import { describe, it, expect } from 'vitest';
import {
  Accordeon,
  HoldButton,
  HoloDecorator,
  MapPin,
  MeshAccordeon,
  NumberPicker,
  PillChip,
  PillChipDecorator,
  SegmentedChip,
  SegmentedChipElement,
  Switch,
  EmailField,
  FlipCard,
  HeroTicker,
  HeroTickerControls,
  HeroTickerDisplay,
  HeroTickerFlourish,
  HeroTickerNib,
  Map,
  VerticalNavBar,
  VerticalNavBarElement,
  PrintPage,
  PrintPageControls,
  PrintPageFab,
  PrintPageFlipView,
  FlipView,
  PrintPageItem,
  SeasonBackground,
  AtmosphereLayer,
  CelestialLayer,
  LandscapeLayer,
  ForegroundGrassLayer,
  ContentProvider,
  useLocale,
  useContentElement,
  useA11yString,
} from '../../src/index.ts';

describe('Library Entry Point Exports', () => {
  it('exports all atomic components', () => {
    expect(Accordeon).toBeDefined();
    expect(HoldButton).toBeDefined();
    expect(HoloDecorator).toBeDefined();
    expect(MapPin).toBeDefined();
    expect(MeshAccordeon).toBeDefined();
    expect(NumberPicker).toBeDefined();
    expect(PillChip).toBeDefined();
    expect(PillChipDecorator).toBeDefined();
    expect(SegmentedChip).toBeDefined();
    expect(SegmentedChipElement).toBeDefined();
    expect(Switch).toBeDefined();
  });

  it('exports all molecular components', () => {
    expect(EmailField).toBeDefined();
    expect(FlipCard).toBeDefined();
    expect(HeroTicker).toBeDefined();
    expect(HeroTickerControls).toBeDefined();
    expect(HeroTickerDisplay).toBeDefined();
    expect(HeroTickerFlourish).toBeDefined();
    expect(HeroTickerNib).toBeDefined();
    expect(Map).toBeDefined();
    expect(VerticalNavBar).toBeDefined();
    expect(VerticalNavBarElement).toBeDefined();
  });

  it('exports all organismic components', () => {
    expect(PrintPage).toBeDefined();
    expect(PrintPageControls).toBeDefined();
    expect(PrintPageFab).toBeDefined();
    expect(PrintPageFlipView).toBeDefined();
    expect(FlipView).toBeDefined();
    expect(PrintPageItem).toBeDefined();
    expect(SeasonBackground).toBeDefined();
    expect(AtmosphereLayer).toBeDefined();
    expect(CelestialLayer).toBeDefined();
    expect(LandscapeLayer).toBeDefined();
    expect(ForegroundGrassLayer).toBeDefined();
  });

  it('exports i18n utilities', () => {
    expect(ContentProvider).toBeDefined();
    expect(useLocale).toBeDefined();
    expect(useContentElement).toBeDefined();
    expect(useA11yString).toBeDefined();
  });
});
