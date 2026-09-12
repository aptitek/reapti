import {
  useRef,
  useEffect,
  createElement,
  type FC,
  type ReactNode,
} from 'react';
import { Box } from 'styled-system/jsx';
import type { FlourishStyle } from './HeroTicker.types.ts';
import { applyFlourishOffset } from './heroTickerHelpers.ts';

export interface HeroTickerFlourishProps {
  flourishStyle?: FlourishStyle;
  colorVar?: string;
  progress?: number;
  visible?: boolean;
  'data-testid'?: string;
  dataTestId?: string;
}

function renderFlourishShape(style: FlourishStyle): ReactNode | null {
  if (style === 'swoosh') {
    return createElement('path', {
      d: 'M 2 12 C 45 4, 130 3, 196 9 C 160 14, 80 13, 22 15',
      stroke: 'url(#heroFlourishGrad)',
      strokeWidth: 2,
      className: 'hero-ticker_flourish-shape',
    });
  }
  if (style === 'wave') {
    return createElement('path', {
      d: 'M 2 8 Q 35 15 70 8 T 140 8 T 198 8',
      stroke: 'url(#heroFlourishGrad)',
      strokeWidth: 2,
      className: 'hero-ticker_flourish-shape',
    });
  }
  if (style === 'glow-line') {
    return createElement('line', {
      x1: 2,
      y1: 8,
      x2: 198,
      y2: 8,
      stroke: 'url(#heroFlourishGrad)',
      strokeWidth: 2,
      className: 'hero-ticker_flourish-shape',
    });
  }
  return null;
}

function resolveFlourishConfig(props: HeroTickerFlourishProps) {
  return {
    style: props.flourishStyle ?? 'swoosh',
    progress: props.progress ?? 100,
    visible: props.visible ?? true,
    testId: props.dataTestId ?? props['data-testid'] ?? 'hero-ticker-flourish',
    color: props.colorVar ?? 'currentColor',
  };
}

function createFlourishCanvas(style: FlourishStyle, color: string) {
  const gradientDef = createElement(
    'defs',
    null,
    createElement(
      'linearGradient',
      { id: 'heroFlourishGrad', x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
      createElement('stop', {
        offset: '0%',
        stopColor: color,
        stopOpacity: 0.1,
      }),
      createElement('stop', {
        offset: '40%',
        stopColor: color,
        stopOpacity: 0.9,
      }),
      createElement('stop', {
        offset: '85%',
        stopColor: color,
        stopOpacity: 1,
      }),
      createElement('stop', {
        offset: '100%',
        stopColor: color,
        stopOpacity: 0.2,
      })
    )
  );

  return createElement(
    'svg',
    {
      viewBox: '0 0 200 16',
      preserveAspectRatio: 'none',
      fill: 'none',
      className: 'hero-ticker_flourish-canvas',
    },
    gradientDef,
    renderFlourishShape(style)
  );
}

export const HeroTickerFlourish: FC<HeroTickerFlourishProps> = (props) => {
  const { style, progress, visible, testId, color } =
    resolveFlourishConfig(props);
  const containerRef = useRef<HTMLDivElement>(null);
  const strokeProgress = Math.max(0, Math.min(100, progress));
  const dashOffset = 200 - (strokeProgress / 100) * 200;

  useEffect(() => {
    applyFlourishOffset(containerRef.current, dashOffset);
  }, [dashOffset]);

  if (!visible || style === 'none') return null;

  return (
    <Box
      ref={containerRef}
      data-testid={testId}
      className="hero-ticker_flourish"
      aria-hidden="true"
    >
      {createFlourishCanvas(style, color)}
    </Box>
  );
};
