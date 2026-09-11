import { useState, useRef, useCallback, useEffect } from 'react';
import type {
  MouseEvent as ReactMouseEvent,
  KeyboardEvent,
  RefObject,
} from 'react';
import { holoGradient, sheenGradient } from '../../../tokens/holo.ts';

export interface UseFlipCardOptions {
  interactive?: boolean;
  hasBackContent?: boolean;
  isFlipped?: boolean;
  defaultFlipped?: boolean;
  onFlip?: (isFlipped: boolean) => void;
  tiltStrength?: number;
  ratio?: string | number;
  holoMaskImage?: string;
}

export interface CardTiltAngles {
  rotateX: number;
  rotateY: number;
}

export interface SheenPosition {
  sheenX: number;
  sheenY: number;
}

export function isInteractiveElement(target: EventTarget | null): boolean {
  if (!target || typeof target !== 'object' || !('closest' in target)) {
    return false;
  }
  const el = target as { closest?: (selector: string) => unknown };
  return Boolean(
    el.closest?.(
      "input, textarea, select, button, a, [role='button'], [data-no-flip]"
    )
  );
}

export function calculateNormalizedCoords(
  clientX: number,
  clientY: number,
  rect: DOMRect
): { normX: number; normY: number } {
  const normX = (clientX - rect.left) / Math.max(1, rect.width) - 0.5;
  const normY = (clientY - rect.top) / Math.max(1, rect.height) - 0.5;
  return {
    normX: Math.max(-0.5, Math.min(0.5, normX)),
    normY: Math.max(-0.5, Math.min(0.5, normY)),
  };
}

export function calculateTiltAngles(
  normX: number,
  normY: number,
  tiltStrength: number
): CardTiltAngles {
  const maxAngle = 15 * tiltStrength;
  return {
    rotateX: -normY * 2 * maxAngle,
    rotateY: normX * 2 * maxAngle,
  };
}

export function calculateSheenPosition(
  normX: number,
  normY: number
): SheenPosition {
  return {
    sheenX: Math.round((0.5 - normX) * 1000) / 10,
    sheenY: Math.round((0.5 - normY) * 1000) / 10,
  };
}

export function applyCardTiltVariables(
  container: HTMLElement | null,
  tilt: CardTiltAngles,
  sheen: SheenPosition
): void {
  if (!container) return;
  container.style.setProperty(
    '--flip-card-rotate-x',
    `${tilt.rotateX.toFixed(2)}deg`
  );
  container.style.setProperty(
    '--flip-card-rotate-y',
    `${tilt.rotateY.toFixed(2)}deg`
  );
  container.style.setProperty('--sheen-x', `${sheen.sheenX}%`);
  container.style.setProperty('--sheen-y', `${sheen.sheenY}%`);
  container.style.setProperty('--mouse-x', `${sheen.sheenX}%`);
  container.style.setProperty('--mouse-y', `${sheen.sheenY}%`);
}

export function applyCardStaticVariables(
  container: HTMLElement | null,
  options: {
    ratio?: string | number;
    holoMaskImage?: string;
    isFlipped: boolean;
  }
): void {
  if (!container) return;
  container.style.setProperty('--holo-gradient', holoGradient);
  container.style.setProperty('--sheen-gradient', sheenGradient);
  container.style.setProperty(
    '--flip-card-flip-angle',
    options.isFlipped ? '180deg' : '0deg'
  );
  if (options.ratio) {
    container.style.setProperty('--flip-card-ratio', String(options.ratio));
  }
  if (options.holoMaskImage) {
    const isDirectCss =
      options.holoMaskImage.includes('url(') ||
      options.holoMaskImage.includes('-gradient');
    const maskVal = isDirectCss
      ? options.holoMaskImage
      : `url("${options.holoMaskImage}")`;
    container.style.setProperty('--holo-mask-image', maskVal);
  }
}

function useCardFlipState(options: {
  canFlip: boolean;
  isControlled: boolean;
  isFlipped: boolean;
  setInternal: (next: boolean) => void;
  onFlip?: (isFlipped: boolean) => void;
}) {
  const { canFlip, isControlled, isFlipped, setInternal, onFlip } = options;

  const toggleFlip = useCallback(() => {
    if (!canFlip) return;
    const next = !isFlipped;
    if (!isControlled) setInternal(next);
    onFlip?.(next);
  }, [canFlip, isFlipped, isControlled, setInternal, onFlip]);

  const handleClick = useCallback(
    (e: ReactMouseEvent) => {
      if (isInteractiveElement(e.target)) return;
      toggleFlip();
    },
    [toggleFlip]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFlip();
      }
    },
    [toggleFlip]
  );

  return { toggleFlip, handleClick, handleKeyDown };
}

function useCardPointerMotion(
  cardRef: RefObject<HTMLDivElement | null>,
  isTiltingEnabled: boolean,
  tiltStrength: number
) {
  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!isTiltingEnabled || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const coords = calculateNormalizedCoords(e.clientX, e.clientY, rect);
      const tilt = calculateTiltAngles(
        coords.normX,
        coords.normY,
        tiltStrength
      );
      const sheen = calculateSheenPosition(coords.normX, coords.normY);
      applyCardTiltVariables(cardRef.current, tilt, sheen);
    },
    [cardRef, isTiltingEnabled, tiltStrength]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isTiltingEnabled || !cardRef.current) return;
    applyCardTiltVariables(
      cardRef.current,
      { rotateX: 0, rotateY: 0 },
      { sheenX: 50, sheenY: 50 }
    );
  }, [cardRef, isTiltingEnabled]);

  return { handleMouseMove, handleMouseLeave };
}

function resolveCardFlags(
  interactive: boolean | undefined,
  hasBackContent: boolean | undefined,
  tiltStrength: number | undefined
) {
  const isInteractive = interactive !== false;
  const canFlip = Boolean(isInteractive && hasBackContent);
  const isTiltingEnabled = Boolean(isInteractive && (tiltStrength ?? 1) > 0);
  return { canFlip, isTiltingEnabled };
}

export function useFlipCard(options: UseFlipCardOptions) {
  const {
    interactive,
    hasBackContent,
    isFlipped: controlledFlipped,
    defaultFlipped = false,
    onFlip,
    tiltStrength = 1,
    ratio,
    holoMaskImage,
  } = options;

  const isControlled = controlledFlipped !== undefined;
  const [internalFlipped, setInternalFlipped] = useState(defaultFlipped);
  const isFlipped = isControlled ? controlledFlipped : internalFlipped;
  const { canFlip, isTiltingEnabled } = resolveCardFlags(
    interactive,
    hasBackContent,
    tiltStrength
  );

  const cardRef = useRef<HTMLDivElement>(null);

  const { toggleFlip, handleClick, handleKeyDown } = useCardFlipState({
    canFlip,
    isControlled,
    isFlipped,
    setInternal: setInternalFlipped,
    onFlip,
  });

  const { handleMouseMove, handleMouseLeave } = useCardPointerMotion(
    cardRef,
    isTiltingEnabled,
    tiltStrength
  );

  const syncVariables = useCallback(() => {
    applyCardStaticVariables(cardRef.current, {
      ratio,
      holoMaskImage,
      isFlipped,
    });
  }, [ratio, holoMaskImage, isFlipped]);

  useEffect(syncVariables, [syncVariables]);

  return {
    cardRef,
    isFlipped,
    canFlip,
    isTiltingEnabled,
    syncVariables,
    toggleFlip,
    handleClick,
    handleKeyDown,
    handleMouseMove,
    handleMouseLeave,
  };
}
