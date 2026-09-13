import type { FC } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eBadge } from '@m3e/react/badge';
import type {
  PillChipProps,
  PillChipDecoratorProps,
} from './PillChipDecorator.types.ts';
import {
  resolvePillChipDecoratorClass,
  resolvePillChipClass,
} from './pillChipDecoratorHelpers.ts';
import './pillChipDecorator.css';

export type { PillChipProps, PillChipDecoratorProps };

export const PillChip: FC<PillChipProps> = ({
  label,
  badge,
  testId,
  onClick,
  className,
  role = 'tooltip',
  ariaHidden = true,
}) => {
  const badgeValue = badge !== undefined ? String(badge) : undefined;
  const chipClass = resolvePillChipClass(className);

  return (
    <Box
      className={chipClass}
      data-testid={testId}
      role={role}
      aria-hidden={ariaHidden ? 'true' : undefined}
      onClick={onClick}
    >
      <Box as="span" className="pill-chip_caption vertical-nav-bar_caption">
        {label}
      </Box>
      {badgeValue !== undefined && (
        <M3eBadge slot="badge">{badgeValue}</M3eBadge>
      )}
    </Box>
  );
};

PillChip.displayName = 'PillChip';

export const PillChipDecorator: FC<PillChipDecoratorProps> = ({
  children,
  label,
  badge,
  active = true,
  open,
  placement = 'end',
  onChipClick,
  chipTestId,
  dataTestId,
  className,
  chipClassName,
}) => {
  const rootClass = resolvePillChipDecoratorClass(className, placement, open);

  return (
    <Box
      className={rootClass}
      data-testid={dataTestId}
      data-placement={placement}
      data-open={open ? 'true' : undefined}
      data-active={active ? 'true' : 'false'}
    >
      {children}
      {active && (
        <PillChip
          label={label}
          badge={badge}
          testId={chipTestId}
          onClick={onChipClick}
          className={chipClassName}
        />
      )}
    </Box>
  );
};

PillChipDecorator.displayName = 'PillChipDecorator';
