import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App, { MainView } from '../../src/App.tsx';
import { ContentProvider } from '../../src/i18n/ContentProvider.tsx';

describe('App Component Unit Tests', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders App with ContentProvider and active locale bindings', () => {
    const html = renderToStaticMarkup(createElement(App));
    expect(html).toBeDefined();
    expect(html).toContain('data-locale="en"');
    expect(html).toContain('m3e-button');
  });

  it('renders PrintPage organism when print=true query param is present', () => {
    vi.stubGlobal('window', {
      location: { search: '?print=true' },
    });

    const html = renderToStaticMarkup(createElement(App));
    expect(html).toContain('printpage_root');
    expect(html).toContain('printpage_viewport_vertical');
    expect(html).not.toContain('printpage_fab_wrapper');
  });

  it('renders PrintPage organism when view=dossier or pdf=true is present', () => {
    vi.stubGlobal('window', {
      location: { search: '?view=dossier' },
    });
    const htmlDossier = renderToStaticMarkup(createElement(App));
    expect(htmlDossier).toContain('printpage_root');

    vi.stubGlobal('window', {
      location: { search: '?pdf=true' },
    });
    const htmlPdf = renderToStaticMarkup(createElement(App));
    expect(htmlPdf).toContain('printpage_root');
  });

  it('handles window undefined and triggers CTA click in MainView', () => {
    vi.stubGlobal('window', undefined);
    let mainViewTree: React.ReactElement | null = null;
    function Probe() {
      mainViewTree = MainView();
      return null;
    }
    renderToStaticMarkup(
      createElement(ContentProvider, null, createElement(Probe))
    );
    expect(mainViewTree).not.toBeNull();
    if (!mainViewTree) return;

    const children = (
      mainViewTree as {
        props: { children: [unknown, { props: { onClick: () => void } }] };
      }
    ).props.children;
    const ctaButton = children[1];
    ctaButton.props.onClick();
  });
});
