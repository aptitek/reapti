import type { ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eSkeleton } from '@m3e/react/skeleton';

export interface MapSkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  aspectRatio?: string;
  className?: string;
  testId?: string;
}

function CartographicRoads(): ReactNode {
  return (
    <>
      <Box
        position="absolute"
        top="48%"
        left="-10%"
        width="120%"
        height="24px"
        transform="translateY(-50%) rotate(-6deg)"
        bg="surfaceContainer"
        opacity={0.65}
        borderTop="1px solid var(--colors-outline-variant)"
        borderBottom="1px solid var(--colors-outline-variant)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        left="42%"
        top="-10%"
        height="120%"
        width="18px"
        bg="surfaceContainer"
        opacity={0.65}
        borderLeft="1px solid var(--colors-outline-variant)"
        borderRight="1px solid var(--colors-outline-variant)"
        pointerEvents="none"
      />
    </>
  );
}

function BuildingBlocks(): ReactNode {
  return (
    <>
      <Box position="absolute" top="18%" left="12%" width="68px" height="42px">
        <M3eSkeleton shape="rounded" animation="wave">
          <Box width="100%" height="100%" borderRadius="small" />
        </M3eSkeleton>
      </Box>
      <Box
        position="absolute"
        bottom="16%"
        left="56%"
        width="78px"
        height="46px"
      >
        <M3eSkeleton shape="rounded" animation="wave">
          <Box width="100%" height="100%" borderRadius="small" />
        </M3eSkeleton>
      </Box>
      <Box position="absolute" top="22%" right="18%" width="56px" height="38px">
        <M3eSkeleton shape="rounded" animation="wave">
          <Box width="100%" height="100%" borderRadius="small" />
        </M3eSkeleton>
      </Box>
    </>
  );
}

function ControlsPlaceholders(): ReactNode {
  return (
    <>
      <Box position="absolute" top="4" left="4" pointerEvents="none" zIndex={2}>
        <M3eSkeleton shape="circular" animation="wave">
          <Box width="24px" height="24px" borderRadius="full" />
        </M3eSkeleton>
      </Box>
      <Box
        position="absolute"
        top="4"
        right="4"
        display="flex"
        flexDirection="column"
        gap="2"
        pointerEvents="none"
        zIndex={2}
      >
        <M3eSkeleton shape="rounded" animation="wave">
          <Box width="32px" height="32px" borderRadius="small" />
        </M3eSkeleton>
        <M3eSkeleton shape="rounded" animation="wave">
          <Box width="32px" height="32px" borderRadius="small" />
        </M3eSkeleton>
      </Box>
    </>
  );
}

function PinPlaceholder(): ReactNode {
  return (
    <Box
      position="absolute"
      left="50%"
      top="50%"
      transform="translate(-50%, -100%)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      pointerEvents="none"
      zIndex={3}
    >
      <M3eSkeleton shape="rounded" animation="wave">
        <Box width="80px" height="20px" borderRadius="full" mb="1" />
      </M3eSkeleton>
      <M3eSkeleton shape="circular" animation="wave">
        <Box width="16px" height="16px" borderRadius="full" />
      </M3eSkeleton>
    </Box>
  );
}

/**
 * MD3 Cartographic Map Skeleton atom for loading states.
 */
export function MapSkeleton({
  width = '100%',
  height = '100%',
  borderRadius = '12px',
  aspectRatio,
  className,
  testId = 'map-skeleton',
}: MapSkeletonProps): ReactNode {
  return (
    <Box
      position="relative"
      width={width}
      height={height}
      aspectRatio={aspectRatio}
      borderRadius={borderRadius}
      overflow="hidden"
      bg="surfaceContainerLow"
      boxSizing="border-box"
      userSelect="none"
      className={className}
      role="progressbar"
      aria-busy="true"
      data-testid={testId}
    >
      <CartographicRoads />
      <BuildingBlocks />
      <ControlsPlaceholders />
      <PinPlaceholder />
    </Box>
  );
}

MapSkeleton.displayName = 'MapSkeleton';
