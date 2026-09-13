import { forwardRef, type FC, type KeyboardEvent } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eIcon } from '@m3e/react/icon';
import { M3eTooltip } from '@m3e/react/tooltip';
import {
  M3eSegmentedChip,
  type SegmentedChipElement,
} from './SegmentedChipElement.ts';
import type {
  SegmentedChipProps,
  ChipSegmentProps,
  SegmentInteraction,
  SegmentedChipItemConfig,
} from './SegmentedChip.types.ts';
import { useSegmentedChip } from './useSegmentedChip.ts';
import {
  resolveSegmentInteraction,
  resolveSegmentedChipRootClass,
  resolveSegmentItemClass,
  resolveAriaProps,
  resolveSegmentAria,
} from './segmentedChipHelpers.ts';
import './segmentedChip.css';

export type { SegmentedChipProps, ChipSegmentProps };

let segmentCounter = 0;

function executeSegmentAction(
  onClick?: () => void,
  href?: string,
  target?: string
): void {
  if (onClick) {
    onClick();
    return;
  }
  if (href && typeof window !== 'undefined') {
    if (target === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  }
}

function handleSegmentKeyDown(
  e: KeyboardEvent,
  interaction: SegmentInteraction,
  action: () => void
): void {
  const isTrigger =
    e.key === 'Enter' || (interaction === 'button' && e.key === ' ');
  if (isTrigger) {
    e.preventDefault();
    action();
  }
}

function resolveSegmentId(id?: string, dataTestId?: string): string {
  if (id) return id;
  if (dataTestId) return `${dataTestId}-segment`;
  segmentCounter += 1;
  return `chip-seg-${segmentCounter}`;
}

function resolveSegmentHandlers(
  isInteractive: boolean,
  disabled: boolean | undefined,
  listeners: { action: () => void; onKey: (e: KeyboardEvent) => void }
) {
  if (disabled || !isInteractive) {
    return { onClick: undefined, onKeyDown: undefined, tabIndex: undefined };
  }
  return { onClick: listeners.action, onKeyDown: listeners.onKey, tabIndex: 0 };
}

const SegmentIcon: FC<{ icon?: string; trailing?: boolean }> = ({
  icon,
  trailing,
}) => {
  if (!icon) return null;
  const className = trailing
    ? 'segmented-chip__trailing-icon'
    : 'segmented-chip__icon';
  const attr = trailing
    ? { 'data-trailing-icon': icon }
    : { 'data-icon': icon };

  return (
    <Box className={className} {...attr} aria-hidden="true">
      <M3eIcon name={icon} />
    </Box>
  );
};

export const ChipSegment: FC<ChipSegmentProps> = (props) => {
  const segmentId = resolveSegmentId(props.id, props.dataTestId);
  const interaction = resolveSegmentInteraction(
    props.interaction,
    props.href,
    props.onClick
  );
  const isInteractive = interaction !== 'none';
  const itemClass = resolveSegmentItemClass(
    props.className,
    interaction,
    props.disabled
  );
  const aria = resolveSegmentAria({
    label: props.label ?? '',
    ariaLabel: props.ariaLabel,
    disabled: props.disabled,
    interaction,
  });

  const onAction = () =>
    executeSegmentAction(props.onClick, props.href, props.target);
  const onKeyDown = (e: KeyboardEvent) =>
    handleSegmentKeyDown(e, interaction, onAction);
  const handlers = resolveSegmentHandlers(isInteractive, props.disabled, {
    action: onAction,
    onKey: onKeyDown,
  });

  return (
    <Box
      id={segmentId}
      className={itemClass}
      data-testid={props.dataTestId}
      data-interaction={interaction}
      {...handlers}
      {...aria}
    >
      <SegmentIcon icon={props.icon} />
      <Box className="segmented-chip__label">
        {props.label}
        {props.children}
      </Box>
      <SegmentIcon icon={props.trailingIcon} trailing />
      {props.tooltip && (
        <M3eTooltip htmlFor={segmentId}>{props.tooltip}</M3eTooltip>
      )}
    </Box>
  );
};

ChipSegment.displayName = 'ChipSegment';

export const ChipSegmentsList: FC<{
  items?: readonly SegmentedChipItemConfig[];
  disabled?: boolean;
  testId: string;
  onItemClick: (item: SegmentedChipItemConfig) => void;
}> = ({ items, disabled, testId, onItemClick }) => {
  if (!items || items.length === 0) return null;
  return (
    <>
      {items.map((item) => {
        const interaction = resolveSegmentInteraction(
          item.interaction,
          item.href,
          item.onClick
        );
        const hasClickAction =
          interaction === 'button' || Boolean(item.onClick);
        const onClick = hasClickAction ? () => onItemClick(item) : undefined;

        return (
          <ChipSegment
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            trailingIcon={item.trailingIcon}
            interaction={interaction}
            disabled={disabled || item.disabled}
            onClick={onClick}
            href={item.href}
            target={item.target}
            tooltip={item.tooltip}
            ariaLabel={item.ariaLabel}
            dataTestId={`${testId}-item-${item.id}`}
          />
        );
      })}
    </>
  );
};

export const SegmentedChip = forwardRef<
  SegmentedChipElement,
  SegmentedChipProps
>((props, ref) => {
  const { handleItemClick } = useSegmentedChip(props);
  const testId = props.dataTestId ?? 'segmented-chip';
  const rootClass = resolveSegmentedChipRootClass(
    props.className,
    props.variant,
    props.size
  );
  const ariaProps = resolveAriaProps(props.ariaLabel);

  return (
    <M3eSegmentedChip
      ref={ref}
      className={rootClass}
      data-testid={testId}
      variant={props.variant}
      size={props.size}
      disabled={props.disabled}
      {...ariaProps}
    >
      <ChipSegmentsList
        items={props.items}
        disabled={props.disabled}
        testId={testId}
        onItemClick={handleItemClick}
      />
      {props.children}
    </M3eSegmentedChip>
  );
});

SegmentedChip.displayName = 'SegmentedChip';
