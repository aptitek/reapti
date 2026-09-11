import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../../src/App.tsx';

describe('App Component Unit Tests', () => {
  it('renders App with ContentProvider and active locale bindings', () => {
    const html = renderToStaticMarkup(createElement(App));
    expect(html).toBeDefined();
    expect(html).toContain('data-locale="en"');
    expect(html).toContain('m3e-button');
  });
});
