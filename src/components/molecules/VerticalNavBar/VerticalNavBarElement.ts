import React from 'react';
import { createComponent } from '@lit/react';
import { css, type CSSResultGroup } from 'lit';
import { M3eNavBarElement, type NavItemOrientation } from '@m3e/web/nav-bar';

/**
 * A vertical navigation bar component that extends M3eNavBarElement.
 * Arranges navigation destinations vertically with compact and expanded modes,
 * customizable widths, vertical keyboard navigation, and slot structure.
 */
export class VerticalNavBarElement extends M3eNavBarElement {
  static override styles: CSSResultGroup = [
    M3eNavBarElement.styles,
    css`
      :host {
        display: block;
        overflow-x: visible;
        overflow-y: auto;
        scrollbar-width: thin;
        inline-size: var(
          --vertical-nav-bar-width,
          var(--vertical-nav-bar-expanded-width, 240px)
        );
        block-size: var(--vertical-nav-bar-height, 100%);
        min-block-size: 100%;
        box-sizing: border-box;
        transition:
          inline-size 300ms cubic-bezier(0.2, 0, 0, 1),
          width 300ms cubic-bezier(0.2, 0, 0, 1);
      }
      :host(:is(:state(--compact), :--compact)),
      :host([mode='compact']) {
        inline-size: var(--vertical-nav-bar-compact-width, 80px);
        width: var(--vertical-nav-bar-compact-width, 80px);
        overflow: visible;
      }
      :host(:not(:is(:state(--compact), :--compact))),
      :host([mode='expanded']) {
        inline-size: var(--vertical-nav-bar-expanded-width, 240px);
        width: var(--vertical-nav-bar-expanded-width, 240px);
      }
      .base {
        contain: style;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        box-sizing: border-box;
        inline-size: 100%;
        width: 100%;
        min-block-size: 100%;
        block-size: 100%;
        padding-block: var(--vertical-nav-bar-padding-block, 16px);
        padding-inline: var(--vertical-nav-bar-padding-inline, 8px);
        gap: var(--vertical-nav-bar-item-gap, 8px);
        background-color: var(
          --vertical-nav-bar-container-color,
          var(--m3e-nav-bar-container-color, inherit)
        );
      }
      ::slotted(m3e-nav-item) {
        flex: none;
      }
      :host(:not(:is(:state(--compact), :--compact))) ::slotted(m3e-nav-item),
      :host([mode='expanded']) ::slotted(m3e-nav-item) {
        align-self: stretch;
        inline-size: 100%;
        --_nav-item-align-self: stretch;
        --_nav-item-justify-content: flex-start;
      }
    `,
  ];

  override connectedCallback(): void {
    if (typeof document !== 'undefined') {
      super.connectedCallback();
    }
    this.addEventListener('keydown', this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    if (typeof document !== 'undefined') {
      super.disconnectedCallback();
    }
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  override _updateOrientation(orientation: NavItemOrientation): void {
    super._updateOrientation(orientation);
  }

  getNavigableItems(): HTMLElement[] {
    if (typeof this.querySelectorAll !== 'function') return [];
    return Array.from(this.querySelectorAll('m3e-nav-item')).filter(
      (item) => !item.hasAttribute('disabled')
    ) as HTMLElement[];
  }

  resolveTargetIndex(key: string, currentIndex: number, total: number): number {
    if (key === 'ArrowDown') {
      return currentIndex >= 0 ? (currentIndex + 1) % total : 0;
    }
    if (key === 'ArrowUp') {
      return currentIndex >= 0 ? (currentIndex - 1 + total) % total : total - 1;
    }
    if (key === 'Home') return 0;
    if (key === 'End') return total - 1;
    return currentIndex;
  }

  handleKeyDown = (event: KeyboardEvent): void => {
    const navKeys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!navKeys.includes(event.key)) return;

    const items = this.getNavigableItems();
    if (items.length === 0) return;

    const rootNode =
      typeof this.getRootNode === 'function' ? this.getRootNode() : null;
    const active =
      rootNode && 'activeElement' in rootNode
        ? (rootNode as Document).activeElement
        : null;
    const currentIndex = active ? items.indexOf(active as HTMLElement) : -1;
    const targetIndex = this.resolveTargetIndex(
      event.key,
      currentIndex,
      items.length
    );

    items[targetIndex]?.focus();
    event.preventDefault();
  };
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('vertical-nav-bar')
) {
  customElements.define('vertical-nav-bar', VerticalNavBarElement);
}

declare global {
  interface HTMLElementTagNameMap {
    'vertical-nav-bar': VerticalNavBarElement;
  }
}

export const M3eVerticalNavBar = createComponent({
  tagName: 'vertical-nav-bar',
  elementClass: VerticalNavBarElement,
  react: React,
  events: {
    onBeforeInput: 'beforeinput',
    onInput: 'input',
    onChange: 'change',
  },
});
