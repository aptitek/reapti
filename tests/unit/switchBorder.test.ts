import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Switch } from '../../src/components/atoms/Switch/Switch.tsx';
import { FancySwitch } from '../../src/components/molecules/FancySwitch/FancySwitch.tsx';

describe('Switch Default Border Specifications', () => {
  it('defines --fancy-switch-track-border using semantic outline token without inset shadow', () => {
    const themeCss = readFileSync(
      resolve(__dirname, '../../src/theme/theme.css'),
      'utf-8'
    );
    expect(themeCss).toMatch(
      /--fancy-switch-track-border:\s*var\(--colors-outline\);/
    );
    expect(themeCss).toMatch(/--fancy-switch-shadow-inset:\s*none;/);
  });

  it('configures FancySwitch track frame border with outline tokens and no box shadow', () => {
    const fancyCss = readFileSync(
      resolve(
        __dirname,
        '../../src/components/molecules/FancySwitch/fancySwitch.css'
      ),
      'utf-8'
    );
    expect(fancyCss).toMatch(
      /\.switch_root\.switch_bimodal\[data-checked='false'\] \.switch_track_frame,\s*\.switch_root\.switch_bimodal\[data-checked='true'\] \.switch_track_frame\s*\{[\s\S]*?border:\s*var\(--m3e-switch-track-outline-width,\s*2px\)\s*solid\s*var\(--fancy-switch-track-border,\s*var\(--colors-outline\)\);/
    );
    // Ensure box-shadow: var(--fancy-switch-shadow-inset) is not present on the track frame
    expect(fancyCss).not.toMatch(
      /\.switch_track_frame\s*\{[\s\S]*?box-shadow:\s*var\(--fancy-switch-shadow-inset\);/
    );
  });

  it('configures base Switch track frame with persistent outline token across states', () => {
    const switchCss = readFileSync(
      resolve(__dirname, '../../src/components/atoms/Switch/switch.css'),
      'utf-8'
    );
    expect(switchCss).toMatch(
      /\.switch_track_frame\s*\{[\s\S]*?border:\s*var\(--m3e-switch-track-outline-width,\s*2px\)\s*solid\s*var\(--switch-track-border-color,\s*var\(--colors-outline\)\);/
    );
    expect(switchCss).toMatch(
      /\.switch_root\[data-checked='true'\] \.switch_track_frame\s*\{[\s\S]*?border-color:\s*var\(--switch-track-border-color,\s*var\(--colors-outline\)\);/
    );
  });

  it('renders Switch and FancySwitch with track frame containers ready for default border styling', () => {
    const baseHtml = renderToStaticMarkup(
      createElement(Switch, {
        checked: false,
        ariaLabel: 'Default switch',
        dataTestId: 'default-switch',
      })
    );
    expect(baseHtml).toContain('switch_track_frame');
    expect(baseHtml).toContain('data-testid="default-switch"');

    const fancyHtml = renderToStaticMarkup(
      createElement(FancySwitch, {
        checked: true,
        bimodal: true,
        ariaLabel: 'Bimodal switch',
        dataTestId: 'bimodal-switch',
      })
    );
    expect(fancyHtml).toContain('switch_bimodal');
    expect(fancyHtml).toContain('switch_track_frame');
  });
});
