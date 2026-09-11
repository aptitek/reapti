import { useState, useCallback } from 'react';

export function useMapZoom(initialZoom: number) {
  const [zoomLevel, setZoomLevel] = useState(initialZoom);
  const zoomIn = useCallback(
    () => setZoomLevel(Math.min(zoomLevel + 1, 20)),
    [zoomLevel]
  );
  const zoomOut = useCallback(
    () => setZoomLevel(Math.max(zoomLevel - 1, 1)),
    [zoomLevel]
  );
  return { zoomLevel, zoomIn, zoomOut };
}
