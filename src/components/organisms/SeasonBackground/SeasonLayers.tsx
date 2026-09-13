import { useEffect, useRef, type FC } from 'react';
import { Box } from 'styled-system/jsx';
import type { Point2D } from './SeasonBackground.types.ts';
import {
  renderGrassSvgString,
  renderHillsSvgString,
  renderTreeSvgString,
  STAR_POSITIONS,
  type FlowerScaleFactors,
} from './seasonBackgroundHelpers.ts';
import { attachAuroraLifecycle } from './seasonAuroraRenderer.ts';
import cloudsSvgRaw from './assets/clouds.svg?raw';
import crescentMoonSvgRaw from './assets/crescent-moon.svg?raw';
import godraysSvgRaw from './assets/godrays.svg?raw';
import grassSvgRaw from './assets/grass.svg?raw';
import hillsSvgRaw from './assets/hills.svg?raw';
import treeSvgRaw from './assets/tree.svg?raw';

export const AtmosphereLayer: FC<{
  showAurora: boolean;
  isDarkMode: boolean;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}> = ({ showAurora, isDarkMode, canvasRef: canvasRefProp }) => {
  const internalRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = canvasRefProp ?? internalRef;

  useEffect(() => {
    if (!isDarkMode || !showAurora || !canvasRef.current) return;
    return attachAuroraLifecycle(canvasRef.current);
  }, [isDarkMode, showAurora, canvasRef]);

  if (!isDarkMode || !showAurora) return null;

  return (
    <Box className="season_aurora_wrapper" aria-hidden="true">
      <Box
        as="canvas"
        ref={canvasRef as never}
        className="season_aurora_canvas"
      />
    </Box>
  );
};

export const CelestialLayer: FC<{
  showCelestial: boolean;
  showGodrays: boolean;
  isDarkMode: boolean;
}> = ({ showCelestial, showGodrays, isDarkMode }) => {
  if (!showCelestial) return null;
  return (
    <>
      <Box
        id="celestialBodyContainer"
        className="season_celestial_container"
        aria-hidden="true"
      >
        {isDarkMode ? (
          <Box className="season_moon_orb">
            <Box
              className="season_moon_svg"
              dangerouslySetInnerHTML={{ __html: crescentMoonSvgRaw }}
            />
          </Box>
        ) : (
          <>
            {showGodrays && (
              <Box
                className="season_godrays_svg"
                dangerouslySetInnerHTML={{ __html: godraysSvgRaw }}
              />
            )}
            <Box className="season_sun_orb" />
          </>
        )}
      </Box>
      {isDarkMode && (
        <Box className="season_starfield_overlay" aria-hidden="true">
          {STAR_POSITIONS.map((star) => (
            <Box
              key={star.id}
              className={`season_star_dot season_star_phase_${star.phase}${star.isSparkle ? ' season_star_sparkle' : ''}`}
              left={star.left}
              top={star.top}
              width={`${star.size}px`}
              height={`${star.size}px`}
              opacity={star.opacity}
            >
              {star.isSparkle && <Box className="season_star_glint" />}
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export const LandscapeLayer: FC<{
  showClouds: boolean;
  showHills: boolean;
  showTree: boolean;
  seasonProgress: number;
  isDarkMode: boolean;
  parallax: Point2D;
  flowerScale?: FlowerScaleFactors;
}> = ({
  showClouds,
  showHills,
  showTree,
  seasonProgress,
  isDarkMode,
  parallax,
  flowerScale,
}) => (
  <>
    {showClouds && (
      <Box
        className="season_clouds"
        dangerouslySetInnerHTML={{ __html: cloudsSvgRaw }}
      />
    )}
    {showHills && (
      <Box
        className="season_hills"
        dangerouslySetInnerHTML={{
          __html: renderHillsSvgString(hillsSvgRaw, seasonProgress, {
            isDarkMode,
            flowerScale,
          }),
        }}
      />
    )}
    {showTree && (
      <Box
        id="peacefulTreeContainer"
        className="season_tree_wrapper"
        transform={`translate(${parallax.x}px, ${parallax.y}px)`}
        dangerouslySetInnerHTML={{
          __html: renderTreeSvgString(treeSvgRaw, seasonProgress, isDarkMode),
        }}
      />
    )}
  </>
);

export const ForegroundGrassLayer: FC<{
  showGrass: boolean;
  seasonProgress: number;
  isDarkMode: boolean;
}> = ({ showGrass, seasonProgress, isDarkMode }) => {
  if (!showGrass) return null;
  return (
    <Box
      className="season_grass_wrapper"
      dangerouslySetInnerHTML={{
        __html: renderGrassSvgString(grassSvgRaw, seasonProgress, isDarkMode),
      }}
    />
  );
};
