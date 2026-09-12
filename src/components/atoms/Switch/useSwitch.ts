import { useState, useCallback } from 'react';
import type { M3eSwitchElement } from './Switch.types.ts';

export function useSwitchInternalState(
  controlledChecked: boolean | undefined,
  defaultChecked: boolean,
  onChange?: (checked: boolean) => void
) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleChange = useCallback(
    (e: Event) => {
      const target = e.currentTarget as M3eSwitchElement | null;
      const nextChecked = Boolean(target?.checked);
      if (!isControlled) {
        setInternalChecked(nextChecked);
      }
      onChange?.(nextChecked);
    },
    [isControlled, onChange]
  );

  return { isChecked, handleChange };
}
