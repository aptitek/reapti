import React from 'react';
import { createComponent } from '@lit/react';
import { html, type CSSResultGroup, type TemplateResult } from 'lit';
import { M3eAppBarElement } from '@m3e/web/app-bar';
import type { NavBarMode } from '../VerticalNavBar/VerticalNavBar.types.ts';
import type { VerticalAppBarSide } from './VerticalAppBar.types.ts';

import { resolveScrollTop } from './verticalAppBarHelpers.ts';
import { verticalAppBarStyles } from './verticalAppBarStyles.ts';

/**
 * A vertical application bar component that extends M3eAppBarElement.
 * Arranges navigation, actions, and brand header vertically on the left or right side of a screen,
 * responding to scroll transitions with elevation and surface tinting.
 */
export class VerticalAppBarElement extends M3eAppBarElement {
  static override properties = {
    side: { type: String, reflect: true },
    mode: { type: String, reflect: true },
    elevated: { type: Boolean, reflect: true },
  };

  declare side: VerticalAppBarSide;
  declare mode: NavBarMode;
  declare elevated: boolean;

  private _windowScrollAttached = false;

  constructor() {
    super();
    this.side = 'left';
    this.mode = 'compact';
    this.elevated = false;
  }

  static override styles: CSSResultGroup = [
    M3eAppBarElement.styles,
    verticalAppBarStyles,
  ];

  override connectedCallback(): void {
    if (typeof document !== 'undefined') {
      super.connectedCallback();
    }
    this._setupWindowScrollListener();
  }

  override disconnectedCallback(): void {
    this._teardownWindowScrollListener();
    if (typeof document !== 'undefined') {
      super.disconnectedCallback();
    }
  }

  private _setupWindowScrollListener(): void {
    if (this._windowScrollAttached || typeof window === 'undefined') return;
    if (!this.htmlFor) {
      window.addEventListener('scroll', this._handleWindowScroll, {
        passive: true,
      });
      this._windowScrollAttached = true;
    }
  }

  private _teardownWindowScrollListener(): void {
    if (this._windowScrollAttached && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this._handleWindowScroll);
      this._windowScrollAttached = false;
    }
  }

  private _handleWindowScroll = (): void => {
    if (this.htmlFor) return;
    const isScrolled = resolveScrollTop() > 0;
    const base = this.renderRoot?.querySelector('.base');
    base?.classList.toggle('on-scroll', isScrolled);
  };

  override firstUpdated(): void {
    this._onTopSlotChange();
  }

  private _hasSlotContent(slotName: string): boolean {
    const slot = this.renderRoot?.querySelector(
      `slot[name="${slotName}"]`
    ) as HTMLSlotElement | null;
    const assigned = slot?.assignedElements({ flatten: true });
    return (assigned?.length ?? 0) > 0;
  }

  private _onTopSlotChange = (): void => {
    const hasContent =
      this._hasSlotContent('header') || this._hasSlotContent('leading');
    const topSection = this.renderRoot?.querySelector('.top-section');
    topSection?.classList.toggle('has-content', hasContent);
  };

  override render(): TemplateResult {
    return html`
      <div class="base" part="base">
        <div class="top-section" part="top">
          <slot name="header" @slotchange=${this._onTopSlotChange}></slot>
          <slot name="leading" @slotchange=${this._onTopSlotChange}></slot>
        </div>
        <div class="middle-section" part="middle">
          <slot></slot>
        </div>
        <div class="bottom-section" part="bottom">
          <slot name="footer"></slot>
          <slot name="trailing"></slot>
        </div>
      </div>
    `;
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('vertical-app-bar')
) {
  customElements.define('vertical-app-bar', VerticalAppBarElement);
}

declare global {
  interface HTMLElementTagNameMap {
    'vertical-app-bar': VerticalAppBarElement;
  }
}

export const M3eVerticalAppBar = createComponent({
  tagName: 'vertical-app-bar',
  elementClass: VerticalAppBarElement,
  react: React,
  events: {},
});
