import type { ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import { useFlipCard } from './useFlipCard.ts';
import './flipCard.css';

export interface FlipCardProps {
  /** The content to display on the front of the card */
  frontContent: ReactNode;
  /** The content to display on the back of the card */
  backContent?: ReactNode;
  /** Whether the card is currently flipped (controlled state) */
  isFlipped?: boolean;
  /** Initial flip state for uncontrolled usage */
  defaultFlipped?: boolean;
  /** Callback fired when flip state changes */
  onFlip?: (isFlipped: boolean) => void;
  /** CSS aspect-ratio string or number (e.g. '85.6/53.98' or 1.58) */
  ratio?: string | number;
  /** 3D tilt strength multiplier on hover. Defaults to 1. Set to 0 to disable */
  tiltStrength?: number;
  /** Whether card is interactive (tilts and flips). Defaults to true */
  interactive?: boolean;
  /** Whether to show holographic foil on front of card */
  showHolo?: boolean;
  /** CSS mask image/gradient for front holo foil */
  holoMaskImage?: string;
  /** Whether to show holographic foil on back of card */
  showHoloBack?: boolean;
  /** CSS mask image/gradient for back holo foil */
  holoMaskImageBack?: string;
  /** Whether to show lighting sheen on hover/tilt. Defaults to true */
  showSheen?: boolean;
  /** Transparent glass mode where backface is visible as mirrored ghost */
  isTransparent?: boolean;
  /** Elevation layer depth (0 to 5) */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /** Accessible label for the card */
  ariaLabel?: string;
  /** Optional custom CSS class */
  className?: string;
  /** Optional test identifier */
  dataTestId?: string;
}

interface CardFaceProps {
  content: ReactNode;
  side: 'front' | 'back';
  isFacingAway: boolean;
  elevation: number;
  showSheen: boolean;
  showHolo: boolean;
  hasMask: boolean;
}

function CardFace({
  content,
  side,
  isFacingAway,
  elevation,
  showSheen,
  showHolo,
  hasMask,
}: CardFaceProps) {
  const sideClass = side === 'front' ? 'flip_card_front' : 'flip_card_back';
  const facingClass = isFacingAway ? 'is-facing-away' : '';
  const faceClasses = `flip_card_face ${sideClass} ${facingClass}`.trim();

  return (
    <Box className={faceClasses} data-elevation={elevation}>
      {content}
      {showSheen ? (
        <Box className="flip_card_sheen" aria-hidden="true" />
      ) : null}
      {showHolo ? (
        <Box
          className="flip_card_holo"
          data-has-mask={hasMask ? 'true' : 'false'}
          aria-hidden="true"
        />
      ) : null}
    </Box>
  );
}

interface FlipCardBodyProps {
  frontContent: ReactNode;
  backContent?: ReactNode;
  isFlipped: boolean;
  elevation: number;
  isSheenActive: boolean;
  showHolo: boolean;
  showHoloBack: boolean;
  holoMaskImage?: string;
  holoMaskImageBack?: string;
}

function FlipCardBody({
  frontContent,
  backContent,
  isFlipped,
  elevation,
  isSheenActive,
  showHolo,
  showHoloBack,
  holoMaskImage,
  holoMaskImageBack,
}: FlipCardBodyProps) {
  return (
    <Box className="flip_card_tilt">
      <Box className="flip_card_flip">
        <CardFace
          content={frontContent}
          side="front"
          isFacingAway={isFlipped}
          elevation={elevation}
          showSheen={isSheenActive}
          showHolo={showHolo}
          hasMask={Boolean(holoMaskImage)}
        />
        {backContent ? (
          <CardFace
            content={backContent}
            side="back"
            isFacingAway={!isFlipped}
            elevation={elevation}
            showSheen={isSheenActive}
            showHolo={showHoloBack}
            hasMask={Boolean(holoMaskImageBack)}
          />
        ) : null}
      </Box>
    </Box>
  );
}

function resolveCardAttributes(
  canFlip: boolean,
  isFlipped: boolean,
  isTransparent: boolean
) {
  return {
    tabIndex: canFlip ? 0 : undefined,
    ariaExpanded: canFlip ? isFlipped : undefined,
    dataFlipped: isFlipped ? 'true' : 'false',
    dataTransparent: isTransparent ? 'true' : 'false',
  };
}

export function FlipCard(props: FlipCardProps) {
  const { isFlipped, canFlip, isTiltingEnabled, cardRef, ...handlers } =
    useFlipCard({
      interactive: props.interactive,
      hasBackContent: Boolean(props.backContent),
      isFlipped: props.isFlipped,
      defaultFlipped: props.defaultFlipped,
      onFlip: props.onFlip,
      tiltStrength: props.tiltStrength,
      ratio: props.ratio,
      holoMaskImage: props.holoMaskImage,
    });

  const attrs = resolveCardAttributes(
    canFlip,
    isFlipped,
    Boolean(props.isTransparent)
  );
  const rootClass =
    `flip_card_root physics-card physic-card ${props.className || ''}`.trim();

  return (
    <Box
      ref={cardRef}
      className={rootClass}
      role="button"
      tabIndex={attrs.tabIndex}
      aria-expanded={attrs.ariaExpanded}
      aria-label={props.ariaLabel}
      data-testid={props.dataTestId}
      data-flipped={attrs.dataFlipped}
      data-transparent={attrs.dataTransparent}
      onClick={handlers.handleClick}
      onKeyDown={handlers.handleKeyDown}
      onMouseMove={handlers.handleMouseMove}
      onMouseLeave={handlers.handleMouseLeave}
    >
      <FlipCardBody
        frontContent={props.frontContent}
        backContent={props.backContent}
        isFlipped={isFlipped}
        elevation={props.elevation ?? 1}
        isSheenActive={isTiltingEnabled && props.showSheen !== false}
        showHolo={Boolean(props.showHolo)}
        showHoloBack={Boolean(props.showHoloBack)}
        holoMaskImage={props.holoMaskImage}
        holoMaskImageBack={props.holoMaskImageBack}
      />
    </Box>
  );
}
