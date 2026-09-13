import type { Locale } from './locales.ts';
import { DEFAULT_LOCALE } from './locales.ts';
import type { A11yKey } from './types.ts';

export const A11Y_STRINGS: Record<Locale, Record<A11yKey, string>> = {
  en: {
    appMain: 'Application View',
    ctaAction: 'Verify Architecture Action',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    mapWebGLDisabledTitle: 'Interactive map unavailable',
    mapWebGLDisabledMessage:
      'WebGL is disabled or unsupported in this browser. Please enable hardware acceleration in your browser settings to view the interactive map.',
    mapFallbackLocationsTitle: 'Pinned Locations',
    mapLoadingAriaLabel: 'Loading map',
    printPageMain: 'Print Page View',
    downloadPdfAriaLabel: 'Download PDF document',
    viewModeVertical: 'Vertical scrolling mode',
    viewModeHorizontal: 'Horizontal scrolling mode',
    viewModeFlip: 'Page flip mode',
    nextPage: 'Next page',
    previousPage: 'Previous page',
    pageIndicator: 'Page navigation',
  },
  fr: {
    appMain: "Vue de l'application",
    ctaAction: "Action de vérification de l'architecture",
    zoomIn: 'Zoomer',
    zoomOut: 'Dézoomer',
    mapWebGLDisabledTitle: 'Carte interactive indisponible',
    mapWebGLDisabledMessage:
      "WebGL est désactivé ou non pris en charge dans ce navigateur. Veuillez activer l'accélération matérielle dans les paramètres de votre navigateur pour afficher la carte interactive.",
    mapFallbackLocationsTitle: 'Lieux épinglés',
    mapLoadingAriaLabel: 'Chargement de la carte',
    printPageMain: "Vue de page d'impression",
    downloadPdfAriaLabel: 'Télécharger le document PDF',
    viewModeVertical: 'Mode défilement vertical',
    viewModeHorizontal: 'Mode défilement horizontal',
    viewModeFlip: 'Mode tourner la page',
    nextPage: 'Page suivante',
    previousPage: 'Page précédente',
    pageIndicator: 'Navigation entre les pages',
  },
  de: {
    appMain: 'Anwendungsansicht',
    ctaAction: 'Aktion zur Überprüfung der Architektur',
    zoomIn: 'Vergrößern',
    zoomOut: 'Verkleinern',
    mapWebGLDisabledTitle: 'Interaktive Karte nicht verfügbar',
    mapWebGLDisabledMessage:
      'WebGL ist in diesem Browser deaktiviert oder wird nicht unterstützt. Bitte aktivieren Sie die Hardwarebeschleunigung in Ihren Browsereinstellungen, um die interaktive Karte anzuzeigen.',
    mapFallbackLocationsTitle: 'Markierte Orte',
    mapLoadingAriaLabel: 'Karte wird geladen',
    printPageMain: 'Druckseiten-Ansicht',
    downloadPdfAriaLabel: 'PDF-Dokument herunterladen',
    viewModeVertical: 'Vertikaler Bildlaufmodus',
    viewModeHorizontal: 'Horizontaler Bildlaufmodus',
    viewModeFlip: 'Seitenumblättermodus',
    nextPage: 'Nächste Seite',
    previousPage: 'Vorherige Seite',
    pageIndicator: 'Seitennavigation',
  },
  es: {
    appMain: 'Vista de la aplicación',
    ctaAction: 'Acción de verificación de arquitectura',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    mapWebGLDisabledTitle: 'Mapa interactivo no disponible',
    mapWebGLDisabledMessage:
      'WebGL está deshabilitado o no es compatible con este navegador. Habilite la aceleración por hardware en la configuración de su navegador para ver el mapa interactivo.',
    mapFallbackLocationsTitle: 'Ubicaciones marcadas',
    mapLoadingAriaLabel: 'Cargando mapa',
    printPageMain: 'Vista de página de impresión',
    downloadPdfAriaLabel: 'Descargar documento PDF',
    viewModeVertical: 'Modo de desplazamiento vertical',
    viewModeHorizontal: 'Modo de desplazamiento horizontal',
    viewModeFlip: 'Modo de cambio de página',
    nextPage: 'Página siguiente',
    previousPage: 'Página anterior',
    pageIndicator: 'Navegación de página',
  },
};

export function resolveA11yString(locale: Locale, key: A11yKey): string {
  const dict = A11Y_STRINGS[locale] ?? A11Y_STRINGS[DEFAULT_LOCALE];
  return dict[key];
}
