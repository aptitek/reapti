import { forwardRef } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eVerticalAppBar } from './VerticalAppBarElement.ts';
import { VerticalNavBar } from '../VerticalNavBar/VerticalNavBar.tsx';
import type { NavBarMode } from '../VerticalNavBar/VerticalNavBar.types.ts';
import type {
  VerticalAppBarProps,
  VerticalAppBarElement,
} from './VerticalAppBar.types.ts';
import { useVerticalAppBar } from './useVerticalAppBar.ts';
import {
  resolveAppBarClassName,
  resolveAriaProps,
} from './verticalAppBarHelpers.ts';
import './verticalAppBar.css';

export type { VerticalAppBarProps, VerticalAppBarElement };

function resolveContent(
  props: VerticalAppBarProps,
  mode: NavBarMode,
  testId: string
) {
  if (props.children) {
    return props.children;
  }
  if (props.items && props.items.length > 0) {
    return (
      <VerticalNavBar
        items={props.items}
        selectedIndex={props.selectedIndex}
        onSelect={props.onSelect}
        mode={mode}
        dataTestId={`${testId}-nav`}
      />
    );
  }
  return null;
}

export const VerticalAppBar = forwardRef<
  VerticalAppBarElement,
  VerticalAppBarProps
>((props, ref) => {
  const { side, isElevated, isScrolled } = useVerticalAppBar(props);
  const mode = props.mode ?? 'compact';
  const testId = props.dataTestId ?? 'vertical-app-bar';
  const ariaProps = resolveAriaProps(props.ariaLabel);
  const rootClassName = resolveAppBarClassName(props.className, side, {
    elevated: isElevated,
    mode,
  });

  return (
    <M3eVerticalAppBar
      ref={ref}
      side={side}
      mode={mode}
      elevated={isElevated}
      htmlFor={props.for}
      className={rootClassName}
      data-side={side}
      data-mode={mode}
      data-scrolled={isScrolled ? 'true' : 'false'}
      data-elevated={isElevated ? 'true' : 'false'}
      data-testid={testId}
      {...ariaProps}
    >
      {props.header && (
        <Box
          slot="header"
          className="vertical-app-bar_header_wrapper"
          data-testid={`${testId}-header`}
        >
          {props.header}
        </Box>
      )}
      <Box
        className="vertical-app-bar_content_wrapper"
        data-testid={`${testId}-content`}
      >
        {resolveContent(props, mode, testId)}
      </Box>
      {props.footer && (
        <Box
          slot="footer"
          className="vertical-app-bar_footer_wrapper"
          data-testid={`${testId}-footer`}
        >
          {props.footer}
        </Box>
      )}
    </M3eVerticalAppBar>
  );
});

VerticalAppBar.displayName = 'VerticalAppBar';
