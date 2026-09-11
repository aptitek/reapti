import type { ReactNode } from 'react';
import { Box, panda } from 'styled-system/jsx';

export interface MapPinProps {
  label?: string;
  color?: string;
  ariaLabel?: string;
  className?: string;
  testId?: string;
}

function GroundShadow(): ReactNode {
  return (
    <Box
      position="absolute"
      bottom="-2px"
      left="50%"
      transform="translateX(-50%)"
      width="16px"
      height="6px"
      borderRadius="full"
      bg="scrim"
      opacity={0.35}
      filter="blur(2px)"
      zIndex={1}
      pointerEvents="none"
    />
  );
}

function RadarRing({ color }: { color: string }): ReactNode {
  return (
    <Box
      position="absolute"
      bottom="-4px"
      left="50%"
      transform="translateX(-50%)"
      width="20px"
      height="20px"
      borderRadius="full"
      bg={color}
      animation="map-radar-pulse 2s cubic-bezier(0.2, 0, 0, 1) infinite"
      pointerEvents="none"
      zIndex={1}
    />
  );
}

function PinVector({ color }: { color: string }): ReactNode {
  return (
    <panda.svg
      width="28px"
      height="36px"
      viewBox="0 0 28 36"
      fill="none"
      position="relative"
      zIndex={2}
      filter="drop-shadow(0 3px 6px var(--colors-scrim))"
      transition="transform 200ms cubic-bezier(0.2, 0, 0, 1)"
      _hover={{ transform: 'scale(1.15) translateY(-2px)' }}
    >
      <panda.path
        d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z"
        fill={color}
      />
      <panda.path
        d="M14 2C7.373 2 2 7.373 2 14C2 17.5 4 21.5 7 26C5 21 4 17 4 14C4 8.477 8.477 4 14 4C17.5 4 20.5 5.8 22.3 8.5C20.3 4.5 16.5 2 14 2Z"
        fill="var(--colors-surface)"
        fillOpacity={0.25}
      />
      <panda.circle cx={14} cy={13} r={5} fill="var(--colors-surface)" />
      <panda.circle cx={14} cy={13} r={2.5} fill={color} />
    </panda.svg>
  );
}

/**
 * MD3-compliant Map Pin atom with ground shadow and pulsing radar ring.
 */
export function MapPin({
  label,
  color = 'var(--colors-primary)',
  ariaLabel,
  className,
  testId = 'map-pin-container',
}: MapPinProps): ReactNode {
  return (
    <Box
      position="relative"
      display="inline-flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-end"
      cursor="pointer"
      userSelect="none"
      transform="translate(-50%, -100%)"
      pointerEvents="auto"
      animation="map-pin-bounce 500ms cubic-bezier(0.2, 0, 0, 1) forwards"
      className={className}
      role="img"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {label && (
        <Box
          position="absolute"
          top="-22px"
          zIndex={3}
          px="2"
          py="0.5"
          borderRadius="full"
          bg={color}
          color="var(--colors-on-primary)"
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="0.02em"
          whiteSpace="nowrap"
          pointerEvents="none"
          maxWidth="160px"
          overflow="hidden"
          textOverflow="ellipsis"
          boxShadow="elevation2"
          data-testid="map-pin-label"
        >
          {label}
        </Box>
      )}

      <GroundShadow />
      <RadarRing color={color} />
      <PinVector color={color} />
    </Box>
  );
}

MapPin.displayName = 'MapPin';
