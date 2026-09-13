import { describe, it, expect } from 'vitest';
import {
  AURORA_VERTEX_SHADER,
  AURORA_FRAGMENT_SHADER,
} from '../../src/components/organisms/SeasonBackground/seasonAuroraShaders.ts';

describe('seasonAuroraShaders - GLSL Definitions', () => {
  it('defines valid vertex shader with coordinates and attributes', () => {
    expect(AURORA_VERTEX_SHADER).toContain('attribute vec2 position;');
    expect(AURORA_VERTEX_SHADER).toContain('varying vec2 vUv;');
    expect(AURORA_VERTEX_SHADER).toContain('gl_Position');
  });

  it('defines valid fragment shader with noise, uniforms, and altitude color logic', () => {
    expect(AURORA_FRAGMENT_SHADER).toContain('precision highp float;');
    expect(AURORA_FRAGMENT_SHADER).toContain('uniform float uTime;');
    expect(AURORA_FRAGMENT_SHADER).toContain('uniform float uAmplitude;');
    expect(AURORA_FRAGMENT_SHADER).toContain('uniform vec3 uColorCyan;');
    expect(AURORA_FRAGMENT_SHADER).toContain('uniform vec3 uColorGreen;');
    expect(AURORA_FRAGMENT_SHADER).toContain('uniform vec3 uColorRed;');
    expect(AURORA_FRAGMENT_SHADER).toContain('float snoise(vec2 v)');
    expect(AURORA_FRAGMENT_SHADER).toContain('vec3 getAltitudeColor(float y)');
    expect(AURORA_FRAGMENT_SHADER).toContain('gl_FragColor');
  });
});
