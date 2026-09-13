export const vertexShader = /* glsl */ `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uFoldProgress;
uniform float uFolds;
uniform float uDepth;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDepth;
varying float vBezel;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Beveled W-fold: flat facets with a tight rounded bezel at creases
  float panelCount = uFolds * 2.0;
  float t = uv.x * panelCount;
  float t2 = mod(t, 2.0);
  float signVal = 1.0;
  float s = t2;
  if (t2 > 1.0) {
    s = 2.0 - t2;
    signVal = -1.0;
  }

  // Bezel radius: 8% of panel width
  float r = 0.08;
  float z = 0.0;
  float ds = 0.0;
  float bezelFactor = 0.0;

  if (s < r) {
    // Bezel fillet at ridge
    float u = s / r;
    z = -0.5 * r * (u * u);
    ds = -u;
    bezelFactor = 1.0 - u;
  } else if (s > 1.0 - r) {
    // Bezel fillet at valley
    float u = (1.0 - s) / r;
    z = -1.0 + 0.5 * r * (u * u);
    ds = -(1.0 - u);
    bezelFactor = 1.0 - u;
  } else {
    // Flat planar facet like CSS
    z = -r * 0.5 - (s - r);
    ds = -1.0;
    bezelFactor = 0.0;
  }

  float zOffset = z * uDepth * uFoldProgress;
  pos.z += zOffset;
  vDepth = zOffset;
  vBezel = bezelFactor * uFoldProgress;

  // Analytical derivative dz/dx across flat facet and bezel
  float dzdt = ds * signVal;
  float dzdx = dzdt * panelCount * uDepth * uFoldProgress;

  vec3 computedNormal = normalize(vec3(-dzdx, 0.0, 1.0));
  vNormal = computedNormal;
  vPosition = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D uTexture;
uniform float uHasTexture;
uniform float uFoldProgress;
uniform float uRadius;
uniform float uAspect;
uniform float uUnfoldedAspect;
uniform vec3 uShadowColor;
uniform vec3 uLightDir;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDepth;
varying float vBezel;

float roundedBoxSdf(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - b + vec2(r);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

vec4 getProceduralMapColor(vec2 uv, float unfoldedAspect) {
  // Pure Solarized color palette (zero pure white/black, zero M3 teal)
  vec3 land = vec3(0.933, 0.910, 0.835);       // Solarized base2 (#eee8d5)
  vec3 dotColor = vec3(0.165, 0.631, 0.596);   // Solarized cyan (#2aa198)
  vec3 road = vec3(0.992, 0.965, 0.890);       // Solarized base3 (#fdf6e3)
  vec3 cardBg = vec3(0.992, 0.965, 0.890);     // Solarized base3 (#fdf6e3)
  vec3 cardBorder = vec3(0.576, 0.631, 0.631); // Solarized base1 (#93a1a1)
  vec3 pin = vec3(0.165, 0.631, 0.596);        // Solarized cyan (#2aa198)
  vec3 bar = vec3(0.576, 0.631, 0.631);        // Solarized base1 (#93a1a1)

  // Coordinate fixed to the paper's unfolded aspect ratio (squishes as paper folds)
  vec2 p = vec2((uv.x - 0.5) * unfoldedAspect, uv.y - 0.5);

  // Base background
  vec3 color = land;

  // Dot grid pattern matching backgroundSize 28px
  vec2 dotGridCoord = abs(fract(p * 14.0) - 0.5);
  float dotDist = length(dotGridCoord);
  float dotMask = 1.0 - smoothstep(0.04, 0.08, dotDist);
  color = mix(color, dotColor, dotMask * 0.35);

  // Diagonal road (rotate -18deg: dy - dx * tan(18deg))
  float roadDist = abs(p.y + 0.325 * p.x);
  float roadMask = 1.0 - smoothstep(0.045, 0.052, roadDist);
  color = mix(color, road, roadMask * 0.85);

  // Center card badge: rounded box (w = 0.16, h = 0.10)
  float cardDist = roundedBoxSdf(p, vec2(0.16, 0.10), 0.035);
  float cardAlpha = 1.0 - smoothstep(0.0, 0.005, cardDist);
  float cardBorderMask = 1.0 - smoothstep(0.005, 0.012, abs(cardDist));

  // Inside card: pin dot and bar
  vec2 pinCenter = p - vec2(0.0, 0.035);
  float pinDist = length(pinCenter);
  float pinMask = 1.0 - smoothstep(0.022, 0.025, pinDist);

  vec2 barCenter = p - vec2(0.0, -0.04);
  float barDist = roundedBoxSdf(barCenter, vec2(0.09, 0.012), 0.012);
  float barMask = 1.0 - smoothstep(0.0, 0.004, barDist);

  vec3 insideCard = mix(cardBg, pin, pinMask);
  insideCard = mix(insideCard, bar, barMask);
  insideCard = mix(insideCard, cardBorder, cardBorderMask);

  color = mix(color, insideCard, cardAlpha);

  return vec4(color, 1.0);
}

void main() {
  // Rounded edges with token radius (aspect-corrected)
  vec2 pBox = vec2((vUv.x - 0.5) * uAspect, vUv.y - 0.5);
  vec2 halfBox = vec2(0.5 * uAspect, 0.5);
  float dist = roundedBoxSdf(pBox, halfBox, uRadius);
  float alpha = 1.0 - smoothstep(0.0, 0.008, dist);
  if (alpha <= 0.0) {
    discard;
  }

  // Base texture or procedural map (anchored to unfolded aspect)
  vec4 color = uHasTexture > 0.5 ? texture2D(uTexture, vUv) : getProceduralMapColor(vUv, uUnfoldedAspect);

  // Lighting calculations on flat facets
  vec3 norm = normalize(vNormal);
  vec3 lightDir = normalize(uLightDir);
  float diffuse = max(0.0, dot(norm, lightDir));

  // Valley ambient occlusion
  float ao = 1.0 - smoothstep(-0.05, -0.25, vDepth) * 0.35 * uFoldProgress;

  // Ridge bezel highlight (Solarized base3 specular gleam on the rounded crease)
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfVec = normalize(lightDir + viewDir);
  float spec = pow(max(0.0, dot(norm, halfVec)), 16.0);
  float bezelHighlight = spec * vBezel * 0.25;
  vec3 highlightColor = vec3(0.992, 0.965, 0.890) * bezelHighlight;

  // Shaded composite: flat planar lighting + bezel highlight + valley AO
  vec3 shaded = color.rgb * (0.68 + 0.35 * diffuse) * ao + highlightColor;
  gl_FragColor = vec4(shaded, color.a * alpha);
}
`;
