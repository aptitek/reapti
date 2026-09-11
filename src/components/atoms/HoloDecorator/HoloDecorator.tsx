import type { ReactElement } from 'react';
import { Box } from 'styled-system/jsx';
import { useHoloDecorator } from './useHoloDecorator.ts';
import './holoDecorator.css';

export interface HoloDecoratorProps {
  /** The arbitrary component to apply the holographic effect to */
  children: ReactElement;
  /** Whether the effect should be applied */
  active?: boolean;
  /**
   * The type of rendering approach:
   * - 'text' applies text background-clip
   * - 'image' uses mask overlay and requires maskUrl
   */
  type?: 'text' | 'image';
  /** Required if type === 'image'. The URL of the image to mask against */
  maskUrl?: string;
  /** Optional mask size for image mode. Default is 'contain' */
  maskSize?: 'contain' | 'cover' | string;
  /** Optional additional CSS class */
  className?: string;
}

export function HoloDecorator({
  children,
  active = true,
  type = 'text',
  maskUrl,
  maskSize = 'contain',
  className = '',
}: HoloDecoratorProps) {
  const { wrapperRef } = useHoloDecorator({
    active,
    type,
    maskUrl,
    maskSize,
  });

  if (!active) {
    return children;
  }

  const modeClass =
    type === 'image' ? 'holo-decorator_image' : 'holo-decorator_text';
  const combinedClass = className ? `${modeClass} ${className}` : modeClass;

  return (
    <Box as="span" ref={wrapperRef} className={combinedClass}>
      {children}
    </Box>
  );
}
