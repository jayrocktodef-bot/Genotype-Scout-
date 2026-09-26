/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  COLORBLIND_PALETTES,
  ANCESTRY_TEXTURE_PATTERNS,
  getColorblindPalette,
  getSegmentColor,
  getSegmentPattern,
  ColorblindMode
} from './ancestryThemes';

describe('Ancestry Colorblind Palettes & Textures (WCAG 2.1 AA Compliance)', () => {
  const CORE_REGIONS = ['EUR', 'AFR', 'EAS', 'SAS', 'AMR', 'OCE', 'MID', 'Other'];
  const MODES: ColorblindMode[] = ['default', 'okabe_ito', 'deuteranopia', 'protanopia', 'tritanopia', 'high_contrast'];

  it('defines all required colorblind modes', () => {
    MODES.forEach(mode => {
      expect(COLORBLIND_PALETTES[mode]).toBeDefined();
      expect(COLORBLIND_PALETTES[mode].name).toBeTypeOf('string');
      expect(COLORBLIND_PALETTES[mode].description).toBeTypeOf('string');
    });
  });

  it('ensures each palette covers every core continental region with valid hex codes', () => {
    MODES.forEach(mode => {
      const palette = COLORBLIND_PALETTES[mode];
      CORE_REGIONS.forEach(region => {
        const color = palette.colors[region];
        expect(color, `Missing color for ${region} in palette ${mode}`).toBeDefined();
        expect(color).toMatch(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
      });
    });
  });

  it('verifies Okabe-Ito palette conforms to scientific colorblind-safe standards', () => {
    const okabe = COLORBLIND_PALETTES.okabe_ito;
    expect(okabe.colors.EUR).toBe('#0072B2'); // Blue
    expect(okabe.colors.AFR).toBe('#009E73'); // Bluish Green
    expect(okabe.colors.EAS).toBe('#D55E00'); // Vermilion
    expect(okabe.colors.SAS).toBe('#F0E442'); // Yellow
    expect(okabe.colors.AMR).toBe('#CC79A7'); // Reddish Purple
    expect(okabe.colors.OCE).toBe('#56B4E9'); // Sky Blue
    expect(okabe.colors.MID).toBe('#E69F00'); // Orange
  });

  it('getColorblindPalette returns the corresponding palette and falls back safely', () => {
    expect(getColorblindPalette('okabe_ito').name).toContain('Okabe-Ito');
    expect(getColorblindPalette('deuteranopia').name).toContain('Deuteranopia');
    // @ts-expect-error test fallback for invalid mode
    expect(getColorblindPalette('nonexistent_mode').name).toBe('Default Vibrant');
  });

  it('getSegmentColor retrieves proper colors for each mode', () => {
    const defaultEur = getSegmentColor('EUR', 'default');
    const okabeEur = getSegmentColor('EUR', 'okabe_ito');
    const deutEur = getSegmentColor('EUR', 'deuteranopia');

    expect(defaultEur).toBe('#3b82f6');
    expect(okabeEur).toBe('#0072B2');
    expect(deutEur).toBe('#0072B2');

    // Unknown continent falls back to Other or default slate
    expect(getSegmentColor('UNKNOWN_REGION', 'default')).toBe('#64748b');
  });

  it('defines distinct tactile texture patterns for color-independent accessibility', () => {
    CORE_REGIONS.forEach(region => {
      const pattern = ANCESTRY_TEXTURE_PATTERNS[region];
      expect(pattern, `Missing texture pattern for ${region}`).toBeDefined();
      expect(pattern.name).toBeTypeOf('string');
      expect(pattern.svgPatternId).toMatch(/^pattern-/);
      expect(pattern.cssPattern).toBeTypeOf('string');
    });

    // Verify distinctive pattern types
    expect(ANCESTRY_TEXTURE_PATTERNS.EUR.cssPattern).toContain('repeating-linear-gradient(45deg');
    expect(ANCESTRY_TEXTURE_PATTERNS.AFR.cssPattern).toBe('none');
    expect(ANCESTRY_TEXTURE_PATTERNS.EAS.cssPattern).toContain('radial-gradient');
    expect(ANCESTRY_TEXTURE_PATTERNS.SAS.cssPattern).toContain('repeating-linear-gradient(-45deg');
    expect(ANCESTRY_TEXTURE_PATTERNS.AMR.cssPattern).toContain('repeating-linear-gradient(0deg');
    expect(ANCESTRY_TEXTURE_PATTERNS.OCE.cssPattern).toContain('repeating-linear-gradient(90deg');
  });

  it('getSegmentPattern returns appropriate pattern with fallback', () => {
    expect(getSegmentPattern('EUR').name).toBe('Diagonal Right');
    expect(getSegmentPattern('UNKNOWN').name).toBe('Diamond Mesh');
  });
});
