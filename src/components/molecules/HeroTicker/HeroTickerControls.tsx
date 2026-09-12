import type { FC, KeyboardEvent } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eIconButton } from '@m3e/react/icon-button';
import { M3eIcon } from '@m3e/react/icon';
import '@m3e/icons/rounded/skip_previous';
import '@m3e/icons/rounded/play_arrow';
import '@m3e/icons/rounded/pause';
import '@m3e/icons/rounded/skip_next';
import { DEFAULT_HERO_TICKER_LABELS } from './heroTickerHelpers.ts';

export interface HeroTickerControlsProps {
  phrases: string[];
  currentIndex: number;
  isPaused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
  onSelectIndex: (index: number) => void;
  previousAriaLabel?: string;
  nextAriaLabel?: string;
  pauseAriaLabel?: string;
  resumeAriaLabel?: string;
  controlsBarAriaLabel?: string;
  'data-testid'?: string;
  dataTestId?: string;
}

function resolvePauseLabel(
  isPaused: boolean,
  resume?: string,
  pause?: string
): string {
  if (isPaused) return resume ?? DEFAULT_HERO_TICKER_LABELS.resume;
  return pause ?? DEFAULT_HERO_TICKER_LABELS.pause;
}

function resolveControlsLabels(props: HeroTickerControlsProps) {
  const prevLabel =
    props.previousAriaLabel ?? DEFAULT_HERO_TICKER_LABELS.previous;
  const nextLabel = props.nextAriaLabel ?? DEFAULT_HERO_TICKER_LABELS.next;
  const pauseLabel = resolvePauseLabel(
    props.isPaused,
    props.resumeAriaLabel,
    props.pauseAriaLabel
  );
  const barLabel =
    props.controlsBarAriaLabel ?? DEFAULT_HERO_TICKER_LABELS.controlsBar;
  const testId =
    props.dataTestId ?? props['data-testid'] ?? 'hero-ticker-controls';
  return { prevLabel, nextLabel, pauseLabel, barLabel, testId };
}

interface DotProps {
  phrase: string;
  idx: number;
  isCurrent: boolean;
  onSelect: (idx: number) => void;
}

export function HeroTickerDot({ phrase, idx, isCurrent, onSelect }: DotProps) {
  const jumpLabel = `${DEFAULT_HERO_TICKER_LABELS.jumpToPrefix}${phrase}`;
  const handleKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(idx);
    }
  };
  return (
    <Box
      role="tab"
      tabIndex={0}
      data-active={isCurrent ? 'true' : 'false'}
      className="hero-ticker_dot"
      aria-selected={isCurrent}
      aria-label={jumpLabel}
      onClick={() => onSelect(idx)}
      onKeyDown={handleKey}
    />
  );
}

interface PlaybackButtonsProps {
  prevLabel: string;
  nextLabel: string;
  pauseLabel: string;
  isPaused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
}

function renderPlaybackButtons(p: PlaybackButtonsProps) {
  return (
    <>
      <M3eIconButton
        size="small"
        variant="standard"
        aria-label={p.prevLabel}
        onClick={p.onPrev}
      >
        <M3eIcon name="skip_previous" variant="rounded" />
      </M3eIconButton>
      <M3eIconButton
        size="small"
        variant="standard"
        aria-label={p.pauseLabel}
        onClick={p.onTogglePause}
      >
        <M3eIcon name={p.isPaused ? 'play_arrow' : 'pause'} variant="rounded" />
      </M3eIconButton>
      <M3eIconButton
        size="small"
        variant="standard"
        aria-label={p.nextLabel}
        onClick={p.onNext}
      >
        <M3eIcon name="skip_next" variant="rounded" />
      </M3eIconButton>
    </>
  );
}

export const HeroTickerControls: FC<HeroTickerControlsProps> = (props) => {
  const {
    phrases,
    currentIndex,
    isPaused,
    onPrev,
    onNext,
    onTogglePause,
    onSelectIndex,
  } = props;
  const { prevLabel, nextLabel, pauseLabel, barLabel, testId } =
    resolveControlsLabels(props);

  return (
    <Box
      data-testid={testId}
      role="group"
      aria-label={barLabel}
      className="hero-ticker_controls"
    >
      {renderPlaybackButtons({
        prevLabel,
        nextLabel,
        pauseLabel,
        isPaused,
        onPrev,
        onNext,
        onTogglePause,
      })}

      <Box
        role="tablist"
        aria-label={barLabel}
        className="hero-ticker_dot-list"
        display="flex"
        alignItems="center"
        gap="1"
        ml="1"
      >
        {phrases.map((phrase, idx) => (
          <HeroTickerDot
            key={phrase}
            phrase={phrase}
            idx={idx}
            isCurrent={idx === currentIndex}
            onSelect={onSelectIndex}
          />
        ))}
      </Box>
    </Box>
  );
};
