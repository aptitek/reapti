import { forwardRef } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eSwitch } from '@m3e/react/switch';
import type { M3eSwitchElement, SwitchProps } from './Switch.types.ts';
import { useSwitchInternalState } from './useSwitch.ts';
import './switch.css';

export type { SwitchProps, M3eSwitchElement };

export const Switch = forwardRef<M3eSwitchElement, SwitchProps>(
  (props, ref) => {
    const {
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      size = 'medium',
      icons = 'none',
      ariaLabel,
      name,
      value = 'on',
      id,
      className,
      dataTestId = 'me3-switch',
    } = props;

    const { isChecked, handleChange } = useSwitchInternalState(
      controlledChecked,
      defaultChecked,
      onChange
    );

    const rootClassName = className
      ? `switch_root override-switch ${className}`
      : 'switch_root override-switch';

    return (
      <Box
        className={rootClassName}
        data-size={size}
        data-checked={isChecked}
        data-disabled={disabled}
        data-icons={icons}
        data-testid={`${dataTestId}-wrapper`}
      >
        <M3eSwitch
          ref={ref}
          id={id}
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          icons={icons}
          aria-label={ariaLabel}
          data-testid={dataTestId}
          onChange={handleChange}
        />
      </Box>
    );
  }
);

Switch.displayName = 'Switch';
