import { describe, it, expect } from 'vitest';
import type {
  HeroTickerSize,
  HeroTickerAnimationMode,
  ThemeAccentRole,
  FlourishStyle,
  HeroTickerProps,
} from '../../src/components/molecules/HeroTicker/HeroTicker.types.ts';

describe('HeroTicker Type Contract Verification', () => {
  it('supports all valid HeroTickerSizes', () => {
    const sizes: HeroTickerSize[] = ['small', 'medium', 'large'];
    expect(sizes).toHaveLength(3);
  });

  it('supports all valid HeroTickerAnimationModes', () => {
    const modes: HeroTickerAnimationMode[] = [
      'cursive-draw',
      'cursive-type',
      'fade',
    ];
    expect(modes).toHaveLength(3);
  });

  it('supports all valid ThemeAccentRoles', () => {
    const roles: ThemeAccentRole[] = [
      'primary',
      'secondary',
      'tertiary',
      'error',
    ];
    expect(roles).toHaveLength(4);
  });

  it('supports all valid FlourishStyles', () => {
    const styles: FlourishStyle[] = ['swoosh', 'wave', 'glow-line', 'none'];
    expect(styles).toHaveLength(4);
  });

  it('constructs a valid HeroTickerProps configuration', () => {
    const props: HeroTickerProps = {
      prefix: 'Prefix ',
      phrases: ['Phrase A', 'Phrase B'],
      suffix: ' Suffix',
      animationMode: 'cursive-draw',
      accentColor: 'secondary',
      accentVar: 'var(--colors-secondary)',
      flourish: 'swoosh',
      as: 'h2',
      size: 'medium',
      drawSpeed: 1000,
      typeSpeed: 50,
      eraseSpeed: 25,
      pauseDuration: 2000,
      pauseOnHover: true,
      pauseOnFocus: true,
      showControls: true,
      showNib: true,
      showQuill: true,
      align: 'center',
      onPhraseChange: (idx, text) => {
        expect(idx).toBeDefined();
        expect(text).toBeDefined();
      },
      className: 'custom-hero',
      dataTestId: 'custom-id',
    };

    expect(props.prefix).toBe('Prefix ');
    expect(props.phrases).toHaveLength(2);
    expect(props.size).toBe('medium');
    expect(props.accentColor).toBe('secondary');
  });
});
