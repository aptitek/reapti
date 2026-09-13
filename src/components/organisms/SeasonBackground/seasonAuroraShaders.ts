export const AURORA_VERTEX_SHADER = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const AURORA_FRAGMENT_SHADER = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform float uTime;
uniform float uAmplitude;
uniform vec2 uResolution;
uniform vec3 uColorCyan;
uniform vec3 uColorGreen;
uniform vec3 uColorRed;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Aurora color strictly changes only with altitude (y coordinate in the sky)
// Low altitude: Cyan/Blue fringe -> Mid altitude: Emerald Green -> High altitude: Crimson Red
vec3 getAltitudeColor(float y) {
  float alt = clamp((y - 0.44) / 0.46, 0.0, 1.0);
  if (alt < 0.14) {
    return mix(uColorCyan, uColorGreen, alt / 0.14);
  }
  return mix(uColorGreen, uColorRed, (alt - 0.14) / 0.86);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  // View height and aspect ratio scaling
  float viewH = max(uResolution.y, 300.0);
  float heightScale = clamp(viewH / 900.0, 0.65, 1.35);
  float aspect = uResolution.x / viewH;
  float xAspect = uv.x * (aspect / 1.778);

  // Vertical placement: positioned higher in the sky above hills
  float baseShift = (clamp(800.0 / viewH, 0.8, 1.25) - 1.0) * 0.05;

  // Front primary curtain: billowing drapery positioned higher in the sky
  float t1 = uTime * 0.10;
  float wave1 = snoise(vec2(xAspect * 1.5 + t1 * 0.7, t1 * 0.3)) * 0.14 * uAmplitude
              + sin(xAspect * 3.4 - t1 * 0.5) * 0.05 * uAmplitude;
  float base1 = 0.50 + baseShift + wave1;
  float h1 = uv.y - base1;
  float edge1 = smoothstep(-0.02, 0.04, h1);
  float foldDistort1 = snoise(vec2(xAspect * 2.6 + t1 * 0.4, uv.y * 0.8));
  float pleatPhase1 = xAspect * 16.0 + foldDistort1 * 2.8 + t1 * 1.2;
  float pleat1 = pow(cos(pleatPhase1) * 0.5 + 0.5, 2.2);
  float rayPhase1 = xAspect * 60.0 + foldDistort1 * 3.4 - t1 * 0.5;
  float ray1 = 0.70 + 0.30 * sin(rayPhase1);
  float rayReach1 = (0.34 + 0.12 * pleat1) * heightScale;
  float span1 = 1.0 - smoothstep(0.03, rayReach1, h1);
  float intensity1 = edge1 * span1 * (0.35 + 0.65 * pleat1) * ray1;

  // Back secondary curtain: higher background fold floating in upper sky
  float t2 = uTime * 0.07 + 4.1;
  float wave2 = snoise(vec2(xAspect * 1.3 - t2 * 0.5, 4.8 + t2 * 0.3)) * 0.12 * uAmplitude
              + sin(xAspect * 2.9 + t2 * 0.4) * 0.04 * uAmplitude;
  float base2 = 0.57 + baseShift + wave2;
  float h2 = uv.y - base2;
  float edge2 = smoothstep(-0.02, 0.04, h2);
  float foldDistort2 = snoise(vec2(xAspect * 2.0 - t2 * 0.3, uv.y * 0.7));
  float pleatPhase2 = xAspect * 12.0 + foldDistort2 * 2.5 - t2 * 0.8;
  float pleat2 = pow(cos(pleatPhase2) * 0.5 + 0.5, 2.0);
  float rayPhase2 = xAspect * 48.0 + foldDistort2 * 3.0 + t2 * 0.4;
  float ray2 = 0.72 + 0.28 * sin(rayPhase2);
  float rayReach2 = (0.30 + 0.10 * pleat2) * heightScale;
  float span2 = 1.0 - smoothstep(0.03, rayReach2, h2);
  float intensity2 = edge2 * span2 * (0.35 + 0.65 * pleat2) * ray2;

  // Combined curtain intensity
  float totalIntensity = clamp(intensity1 * 1.25 + intensity2 * 0.75, 0.0, 1.0);

  // Soft atmospheric boundary falloff
  float bottomFade = smoothstep(0.38, 0.48, uv.y);
  float topFade = 1.0 - smoothstep(0.88, 0.98, uv.y);
  float alpha = clamp(totalIntensity * bottomFade * topFade, 0.0, 0.95);

  // Aurora color changes strictly with altitude
  vec3 col = getAltitudeColor(uv.y);

  gl_FragColor = vec4(col * alpha, alpha);
}
`;
