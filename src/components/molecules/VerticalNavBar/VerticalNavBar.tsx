import { forwardRef, type FC } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eNavItem } from '@m3e/react/nav-bar';
import { M3eIcon } from '@m3e/react/icon';
import { M3eBadge } from '@m3e/react/badge';
import { M3eVerticalNavBar } from './VerticalNavBarElement.ts';
import type {
  VerticalNavBarProps,
  VerticalNavBarItemConfig,
  VerticalNavBarElement,
} from './VerticalNavBar.types.ts';
import { useVerticalNavBar } from './useVerticalNavBar.ts';
import {
  resolveRootClassName,
  resolveAriaProps,
  resolveItemIcon,
} from './verticalNavBarHelpers.ts';
import './verticalNavBar.css';

export type { VerticalNavBarProps, VerticalNavBarElement };

interface NavFlyoutChipProps {
  label: string;
  badge?: string;
  testId: string;
  onClick?: () => void;
}

const NavFlyoutChip: FC<NavFlyoutChipProps> = ({
  label,
  badge,
  testId,
  onClick,
}) => (
  <Box
    className="vertical-nav-bar_chip"
    data-testid={testId}
    role="tooltip"
    aria-hidden="true"
    onClick={onClick}
  >
    <Box className="vertical-nav-bar_caption">{label}</Box>
    {badge !== undefined && <M3eBadge slot="badge">{badge}</M3eBadge>}
  </Box>
);

interface NavItemRowProps {
  item: VerticalNavBarItemConfig;
  isSelected: boolean;
  isCompact: boolean;
  onSelect: () => void;
  dataTestId: string;
}

const NavItemRow: FC<NavItemRowProps> = ({
  item,
  isSelected,
  isCompact,
  onSelect,
  dataTestId,
}) => {
  const icon = resolveItemIcon(item, isSelected);
  const badgeValue = item.badge !== undefined ? String(item.badge) : undefined;
  const itemTestId = `${dataTestId}-item-${item.id}`;
  const chipTestId = `${dataTestId}-chip-${item.id}`;
  const orientation = isCompact ? 'vertical' : 'horizontal';

  return (
    <Box className="vertical-nav-bar_entry" data-testid={itemTestId}>
      <M3eNavItem
        selected={isSelected}
        disabled={item.disabled}
        href={item.href}
        target={item.target}
        orientation={orientation}
        data-orientation={orientation}
        onClick={onSelect}
      >
        {icon && <M3eIcon slot="icon" name={icon} />}
        {badgeValue !== undefined && (
          <M3eBadge slot="badge">{badgeValue}</M3eBadge>
        )}
        <Box className="vertical-nav-bar_label">{item.label}</Box>
      </M3eNavItem>
      {isCompact && (
        <NavFlyoutChip
          label={item.label}
          badge={badgeValue}
          testId={chipTestId}
          onClick={onSelect}
        />
      )}
    </Box>
  );
};

export interface NavItemsListProps {
  items?: readonly VerticalNavBarItemConfig[];
  activeIndex: number;
  effectiveMode: 'compact' | 'expanded';
  onSelect: (index: number, item?: VerticalNavBarItemConfig) => void;
  dataTestId: string;
}

export const NavItemsList: FC<NavItemsListProps> = ({
  items,
  activeIndex,
  effectiveMode,
  onSelect,
  dataTestId,
}) => {
  if (!items || items.length === 0) return null;

  const isCompact = effectiveMode === 'compact';

  return (
    <>
      {items.map((item, index) => (
        <NavItemRow
          key={item.id}
          item={item}
          isSelected={activeIndex === index}
          isCompact={isCompact}
          onSelect={() => onSelect(index, item)}
          dataTestId={dataTestId}
        />
      ))}
    </>
  );
};

export const VerticalNavBar = forwardRef<
  VerticalNavBarElement,
  VerticalNavBarProps
>((props, ref) => {
  const { effectiveMode, activeIndex, handleSelect } = useVerticalNavBar(props);
  const testId = props.dataTestId ?? 'vertical-nav-bar';
  const ariaProps = resolveAriaProps(props.ariaLabel);

  return (
    <M3eVerticalNavBar
      ref={ref}
      mode={effectiveMode}
      className={resolveRootClassName(props.className, effectiveMode)}
      data-mode={effectiveMode}
      data-testid={testId}
      {...ariaProps}
    >
      {props.header && (
        <Box
          className="vertical-nav-bar_header"
          data-testid={`${testId}-header`}
        >
          {props.header}
        </Box>
      )}
      {props.action && (
        <Box
          className="vertical-nav-bar_action"
          data-testid={`${testId}-action`}
        >
          {props.action}
        </Box>
      )}
      <NavItemsList
        items={props.items}
        activeIndex={activeIndex}
        effectiveMode={effectiveMode}
        onSelect={handleSelect}
        dataTestId={testId}
      />
      {props.children}
      {props.footer && (
        <Box
          className="vertical-nav-bar_footer"
          data-testid={`${testId}-footer`}
        >
          {props.footer}
        </Box>
      )}
    </M3eVerticalNavBar>
  );
});

VerticalNavBar.displayName = 'VerticalNavBar';
