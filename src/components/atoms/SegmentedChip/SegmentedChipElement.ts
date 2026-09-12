import React from 'react';
import { createComponent } from '@lit/react';
import { LitElement, html, css, type CSSResultGroup } from 'lit';
import type {
  SegmentedChipVariant,
  SegmentedChipSize,
} from './SegmentedChip.types.ts';

/**
 * Custom element representing a segmented chip container.
 * Coordinates outer pill corner states on first/last chip segments and adapts width to content.
 */
export class SegmentedChipElement extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  declare variant: SegmentedChipVariant;
  declare size: SegmentedChipSize;
  declare disabled: boolean;

  constructor() {
    super();
    this.variant = 'outlined';
    this.size = 'medium';
    this.disabled = false;
  }

  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      align-items: center;
      box-sizing: border-box;
      inline-size: max-content;
      max-inline-size: 100%;
    }
    :host([hidden]) {
      display: none;
    }
  `;

  override connectedCallback(): void {
    if (typeof document !== 'undefined') {
      super.connectedCallback();
    }
    this.updateSegmentBoundaries();
  }

  handleSlotChange = (): void => {
    this.updateSegmentBoundaries();
  };

  updateSegmentBoundaries(): void {
    if (typeof this.querySelectorAll !== 'function') return;
    const segments = Array.from(
      this.querySelectorAll('chip-segment, .segmented-chip__segment')
    ) as HTMLElement[];
    const total = segments.length;

    segments.forEach((segment, index) => {
      const isFirst = index === 0;
      const isLast = index === total - 1;
      segment.toggleAttribute('data-first', isFirst);
      segment.toggleAttribute('data-last', isLast);
    });
  }

  override render(): unknown {
    return html`<slot @slotchange="${this.handleSlotChange}"></slot>`;
  }
}

/**
 * Custom element representing an individual chip segment within a SegmentedChip.
 */
export class ChipSegmentElement extends LitElement {
  static override properties = {
    disabled: { type: Boolean, reflect: true },
    icon: { type: String },
    trailingIcon: { type: String, attribute: 'trailing-icon' },
    href: { type: String },
    target: { type: String },
  };

  declare disabled: boolean;
  declare icon?: string;
  declare trailingIcon?: string;
  declare href?: string;
  declare target?: string;

  constructor() {
    super();
    this.disabled = false;
  }

  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      position: relative;
      inline-size: max-content;
      max-inline-size: 100%;
      flex: 0 0 auto;
    }
    :host([hidden]) {
      display: none;
    }
  `;

  override render(): unknown {
    return html`
      <slot name="icon"></slot>
      <slot></slot>
      <slot name="trailing-icon"></slot>
    `;
  }
}

export function registerSegmentedChipElements(): void {
  if (
    typeof customElements !== 'undefined' &&
    !customElements.get('segmented-chip')
  ) {
    customElements.define('segmented-chip', SegmentedChipElement);
  }

  if (
    typeof customElements !== 'undefined' &&
    !customElements.get('chip-segment')
  ) {
    customElements.define('chip-segment', ChipSegmentElement);
  }
}

registerSegmentedChipElements();

declare global {
  interface HTMLElementTagNameMap {
    'segmented-chip': SegmentedChipElement;
    'chip-segment': ChipSegmentElement;
  }
}

export const M3eSegmentedChip = createComponent({
  tagName: 'segmented-chip',
  elementClass: SegmentedChipElement,
  react: React,
  events: {
    onClick: 'click',
  },
});

export const M3eChipSegment = createComponent({
  tagName: 'chip-segment',
  elementClass: ChipSegmentElement,
  react: React,
  events: {
    onClick: 'click',
  },
});
