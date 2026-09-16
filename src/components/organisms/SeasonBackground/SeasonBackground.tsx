import { useEffect, useRef, useState, type FC, type RefObject } from 'react';
import { Box } from 'styled-system/jsx';
import type {
  MouseState,
  Point2D,
  SeasonBackgroundProps,
  WindState,
} from './SeasonBackground.types.ts';
import {
  calculateFlowerScale,
  resolveBackgroundConfig,
  resolveIsDark,
  type FlowerScaleFactors,
} from './seasonBackgroundHelpers.ts';
import {
  AtmosphereLayer,
  CelestialLayer,
  ForegroundGrassLayer,
  LandscapeLayer,
} from './SeasonLayers.tsx';
import {
  resolveSeasonProgress,
  type ResolvedBackgroundConfig,
} from './seasonUtils.ts';
import { resolveSkySpace } from './seasonCanopyMetrics.ts';
import { useSeasonCanvas } from './useSeasonCanvas.ts';
import { useSeasonPointer } from './useSeasonPointer.ts';
import './seasonBackground.css';

function useSeasonRefs(windIntensity: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseStateRef = useRef<MouseState>({
    x: 400,
    y: 300,
    targetX: 400,
    targetY: 300,
    speedX: 0,
    speedY: 0,
  });
  const windStateRef = useRef<WindState>({
    baseSpeedX: 0.85 * windIntensity,
    baseSpeedY: 0,
    currentX: 0.85 * windIntensity,
    currentY: 0,
    gustBoost: 0,
  });
  return { containerRef, canvasRef, mouseStateRef, windStateRef };
}

function useContainerDimensions(
  containerRef: RefObject<HTMLDivElement | null>
) {
  const [size, setSize] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || 1440;
      const h = el.clientHeight || 900;
      setSize({ width: w, height: h });
    };
    update();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [containerRef]);

  return size;
}

interface SeasonBackdropLayersProps {
  config: ResolvedBackgroundConfig;
  isDarkMode: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  seasonProgress: number;
  parallaxOffset: Point2D;
  flowerScale: FlowerScaleFactors;
  treeOverlay?: React.ReactNode;
}

const SeasonBackdropLayers: FC<SeasonBackdropLayersProps> = (props) => {
  const {
    config,
    isDarkMode,
    canvasRef,
    seasonProgress,
    parallaxOffset,
    flowerScale,
    treeOverlay,
  } = props;
  return (
    <>
      <Box className="season_sky_backdrop" />
      <Box className="season_ambient_glow" />
      <AtmosphereLayer showAurora={config.showAurora} isDarkMode={isDarkMode} />
      <CelestialLayer
        showCelestial={config.showCelestial}
        showGodrays={config.showGodrays}
        isDarkMode={isDarkMode}
      />
      <Box as="canvas" ref={canvasRef as never} className="season_canvas" />
      <LandscapeLayer
        showClouds={config.showClouds}
        showHills={config.showHills}
        showTree={config.showTree}
        seasonProgress={seasonProgress}
        isDarkMode={isDarkMode}
        parallax={parallaxOffset}
        flowerScale={flowerScale}
        treeOverlay={treeOverlay}
      />
      <ForegroundGrassLayer
        showGrass={config.showGrass}
        seasonProgress={seasonProgress}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

function useSeasonSkySpace(
  containerRef: RefObject<HTMLDivElement | null>,
  skySpace?: string
) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el?.style) return;
    if (skySpace) {
      el.style.setProperty('--season-sky-space', skySpace);
    } else {
      el.style.removeProperty('--season-sky-space');
    }
  }, [containerRef, skySpace]);
}

function useSeasonBackgroundSetup(
  props: SeasonBackgroundProps,
  propContainerRef?: RefObject<HTMLDivElement | null>
) {
  const config = resolveBackgroundConfig(props);
  const resolvedSkySpace = resolveSkySpace(config.skySpace);
  const refs = useSeasonRefs(config.windIntensity);
  const containerRef = propContainerRef ?? refs.containerRef;
  const containerSize = useContainerDimensions(containerRef);
  useSeasonSkySpace(containerRef, resolvedSkySpace);
  return { config, refs, containerRef, containerSize };
}

export const SeasonBackground: FC<SeasonBackgroundProps> = (props) => {
  const {
    children,
    className,
    mode,
    dataTestId = 'season-background',
    containerRef: propContainerRef,
  } = props;
  const isDarkMode = resolveIsDark(mode);
  const { config, refs, containerRef, containerSize } =
    useSeasonBackgroundSetup(props, propContainerRef);
  const { canvasRef, mouseStateRef, windStateRef } = refs;
  const flowerScale = calculateFlowerScale(
    containerSize.width,
    containerSize.height
  );
  const seasonProgress = resolveSeasonProgress(
    config.season,
    config.seasonProgress
  );

  const parallaxOffset = useSeasonPointer({
    interactive: config.interactive,
    containerRef,
    mouseStateRef,
  });

  useSeasonCanvas({
    canvasRef,
    containerRef,
    leafCount: config.leafCount,
    windIntensity: config.windIntensity,
    isDarkMode,
    mouseStateRef,
    windStateRef,
    seasonProgress,
    skySpace: config.skySpace,
  });

  return (
    <Box
      ref={containerRef}
      className={`season_bg_root ${className ?? ''}`}
      data-mode={isDarkMode ? 'dark' : 'light'}
      data-testid={dataTestId}
    >
      <SeasonBackdropLayers
        config={config}
        isDarkMode={isDarkMode}
        canvasRef={canvasRef}
        seasonProgress={seasonProgress}
        parallaxOffset={parallaxOffset}
        flowerScale={flowerScale}
        treeOverlay={props.treeOverlay}
      />
      {children && <Box className="season_content_wrapper">{children}</Box>}
    </Box>
  );
};
