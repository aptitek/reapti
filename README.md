# reapti-02

A high-performance Material Design 3 React component library powered by Panda CSS.

## Installation

Install the package via `pnpm`:

```bash
pnpm add reapti-02
```

Ensure peer dependencies (`react` and `react-dom` >= 18.0.0 or 19.x) are installed in your project:

```bash
pnpm add react react-dom
```

## Setup & Styles

Import the compiled library stylesheet once at the root of your application (e.g., in `main.tsx` or `App.tsx`):

```tsx
import 'reapti-02/style.css';
```

## Component Usage

All components and their corresponding TypeScript types can be imported directly from `reapti-02`:

```tsx
import {
  HeroTicker,
  Accordeon,
  HoldButton,
  NumberPicker,
  SegmentedChip,
  FlipCard,
  Map,
  PrintPage,
  SeasonBackground,
  ContentProvider,
} from 'reapti-02';

export function ExampleView() {
  return (
    <ContentProvider>
      <HeroTicker
        prefix="Discover"
        phrases={['Responsive Design', 'Fluid Animation', 'Material 3']}
        suffix="today."
      />
      <HoldButton durationMs={1500} onTrigger={() => console.log('Confirmed!')}>
        Hold to Confirm
      </HoldButton>
      <NumberPicker mode="single" min={0} max={100} />
    </ContentProvider>
  );
}
```

## Available Components

### Atoms

- `Accordeon`: 3D accordion fold component with configurable folds and angle.
- `HoldButton`: Action button requiring deliberate hold gesture with progress animation.
- `HoloDecorator`: Holographic iridescent visual treatment decorator.
- `MapPin`: Interactive pin marker with radar ping and elevation shadow.
- `MeshAccordeon`: Soft mesh-deformed 3D accordion folding container.
- `NumberPicker`: Precision stepper control supporting single values and ranges.
- `SegmentedChip`: Material 3 segmented chip group with single/multi-selection.
- `Switch`: Material 3 expressive switch with icons and state morphing.

### Molecules

- `EmailField`: Validating email input field with domain suggestions and lock indicator.
- `FlipCard`: 3D perspective card with front/back flip animations and lighting sheen.
- `HeroTicker`: Animated cursive calligraphy headline with quill trajectory flourishes.
- `Map`: MapLibre GL 3D vector map with interactive pins and theme switching.
- `VerticalNavBar`: Responsive vertical navigation rail with compact and expanded modes.

### Organisms

- `PrintPage`: Publication layout organism supporting multi-page dossier and 3D page flip.
- `SeasonBackground`: Dynamic atmospheric landscape with seasonal foliage, weather, and physics.

### Providers

- `ContentProvider`: Multi-language i18n content context provider.
