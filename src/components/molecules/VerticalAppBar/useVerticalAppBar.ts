import type {
  VerticalAppBarProps,
  VerticalAppBarSide,
} from './VerticalAppBar.types.ts';
import { resolveSide } from './verticalAppBarHelpers.ts';

export interface UseVerticalAppBarResult {
  side: VerticalAppBarSide;
  isScrolled: boolean;
  isElevated: boolean;
}

export function useVerticalAppBar(
  props: VerticalAppBarProps
): UseVerticalAppBarResult {
  const side = resolveSide(props.side);
  const isElevated = Boolean(props.elevated);

  return {
    side,
    isScrolled: false,
    isElevated,
  };
}
