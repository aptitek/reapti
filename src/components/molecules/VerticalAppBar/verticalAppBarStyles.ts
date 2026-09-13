import { css } from 'lit';

export const verticalAppBarStyles = css`
  :host {
    display: block;
    position: sticky;
    inset-block-start: 0;
    z-index: 50;
    overflow: visible;
    block-size: 100vb;
    min-block-size: 100%;
    box-sizing: border-box;
    inline-size: auto;
    flex: none;
  }
  :host([mode='compact']) {
    inline-size: var(--vertical-nav-bar-compact-width, 80px);
  }
  :host([mode='expanded']) {
    inline-size: var(--vertical-nav-bar-expanded-width, 240px);
  }
  :host([side='left']) {
    inset-inline-start: 0;
    inset-inline-end: auto;
  }
  :host([side='right']) {
    inset-inline-start: auto;
    inset-inline-end: 0;
  }
  .base {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    block-size: 100%;
    min-block-size: 100%;
    inline-size: 100%;
    overflow: visible;
    background-color: var(
      --m3e-app-bar-container-color,
      var(--colors-surface, #ffffff)
    );
    transition:
      background-color 200ms cubic-bezier(0.2, 0, 0, 1),
      box-shadow 200ms cubic-bezier(0.2, 0, 0, 1),
      border-color 200ms cubic-bezier(0.2, 0, 0, 1);
    border-inline-end: 1px solid transparent;
  }
  :host([side='left']) .base {
    border-inline-end: 1px solid
      var(--colors-outline-variant, rgba(0, 0, 0, 0.08));
  }
  :host([side='right']) .base {
    border-inline-start: 1px solid
      var(--colors-outline-variant, rgba(0, 0, 0, 0.08));
  }
  .base.on-scroll,
  :host([elevated]) .base {
    background-color: var(
      --m3e-app-bar-container-color-on-scroll,
      var(--colors-surface-container, #f3f3f3)
    );
    box-shadow: var(
      --m3e-app-bar-container-elevation-on-scroll,
      0 1px 3px 1px rgba(0, 0, 0, 0.15),
      0 1px 2px 0 rgba(0, 0, 0, 0.3)
    );
  }
  .top-section {
    flex: none;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-block: var(--vertical-app-bar-top-padding, 16px);
    padding-inline: var(--vertical-app-bar-padding-inline, 12px);
    overflow: visible;
  }
  .top-section.has-content {
    display: flex;
  }
  .middle-section {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    overflow: visible;
  }
  .bottom-section {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding-block: var(--vertical-app-bar-bottom-padding, 16px);
    padding-inline: var(--vertical-app-bar-padding-inline, 12px);
    gap: var(--vertical-app-bar-bottom-gap, 12px);
    overflow: visible;
  }
  @media (max-width: 768px) {
    :host,
    :host([mode='compact']),
    :host([mode='expanded']) {
      position: fixed;
      inset-block-start: 0;
      inset-inline-start: 0;
      inset-inline-end: 0;
      inline-size: 100%;
      block-size: 64px;
      min-block-size: 64px;
      z-index: 100;
    }
    .base {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      block-size: 64px;
      padding-inline: 16px;
      border-inline-end: none;
      border-block-end: 1px solid
        var(--colors-outline-variant, rgba(0, 0, 0, 0.08));
    }
    :host([side='left']) .base,
    :host([side='right']) .base {
      border-inline-start: none;
      border-inline-end: none;
      border-block-end: 1px solid
        var(--colors-outline-variant, rgba(0, 0, 0, 0.08));
    }
    .top-section {
      display: none !important;
    }
    .middle-section {
      flex: 1 1 auto;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      block-size: 100%;
    }
    .bottom-section {
      flex: none;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      padding-block: 0;
      padding-inline: 0;
      gap: 8px;
      block-size: 100%;
    }
  }
`;
