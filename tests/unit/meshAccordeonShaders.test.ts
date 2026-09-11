import { describe, it, expect } from 'vitest';
import {
  vertexShader,
  fragmentShader,
} from '../../src/components/atoms/MeshAccordeon/meshAccordeonShaders.ts';

describe('MeshAccordeon Shaders', () => {
  it('exports valid vertex shader GLSL with beveled fold deformation and analytical normals', () => {
    expect(vertexShader).toContain('uniform float uFoldProgress;');
    expect(vertexShader).toContain('uniform float uFolds;');
    expect(vertexShader).toContain('uniform float uDepth;');
    expect(vertexShader).toContain('varying vec3 vNormal;');
    expect(vertexShader).toContain('varying float vDepth;');
    expect(vertexShader).toContain('varying float vBezel;');

    // Verify beveled W-fold logic
    expect(vertexShader).toContain(
      'Beveled W-fold: flat facets with a tight rounded bezel at creases'
    );
    expect(vertexShader).toContain('float r = 0.08;');
    // Verify analytical normal computation
    expect(vertexShader).toContain(
      'computedNormal = normalize(vec3(-dzdx, 0.0, 1.0));'
    );
  });

  it('exports valid fragment shader GLSL with SDF corner radius and bezel highlights', () => {
    expect(fragmentShader).toContain('float roundedBoxSdf');
    expect(fragmentShader).toContain('uniform float uRadius;');
    expect(fragmentShader).toContain('uniform vec3 uLightDir;');
    expect(fragmentShader).toContain('getProceduralMapColor');

    // Verify ambient occlusion and ridge bezel highlight
    expect(fragmentShader).toContain('float ao = 1.0 - smoothstep');
    expect(fragmentShader).toContain(
      'float bezelHighlight = spec * vBezel * 0.25;'
    );
  });
});
