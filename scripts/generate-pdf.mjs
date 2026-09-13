#!/usr/bin/env node
/**
 * Build-Time Playwright PDF Document Generator
 * Renders the A4 PrintPage organism using headless Chromium at build time,
 * guaranteeing pixel-accurate A4 layout with interactive controls and FABs omitted.
 */

import { createServer } from 'vite';
import { chromium } from 'playwright';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, statSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const outputDir = resolve(rootDir, 'public/documents');
const outputPath = resolve(outputDir, 'document.pdf');

export async function generateStaticPdf({
  port = 5194,
  output = outputPath,
} = {}) {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // 1. Launch temporary Vite server to serve the React application
  const server = await createServer({
    root: rootDir,
    server: {
      port,
      strictPort: false,
    },
    logLevel: 'error',
  });
  await server.listen();

  const address = server.httpServer?.address();
  const actualPort =
    typeof address === 'object' && address !== null ? address.port : port;
  const targetUrl = `http://localhost:${actualPort}/?print=true`;

  let browser;
  try {
    // 2. Launch headless Chromium via Playwright
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // 3. Navigate with ?print=true ensuring PDF mode and unmounted FAB
    await page.goto(targetUrl, { waitUntil: 'networkidle' });

    // Ensure M3e card elements and styled-system content are fully mounted
    await page.waitForSelector('m3e-card', { timeout: 15000 });

    // Assert that the FAB is NEVER rendered in Playwright
    const fabElement = await page.$('.print-page-fab-wrapper');
    if (fabElement !== null) {
      throw new Error(
        'FAB element was unexpectedly rendered in Playwright print mode.'
      );
    }

    // 4. Emulate print media and generate static A4 PDF
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: output,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    });

    const stats = statSync(output);
    return {
      path: output,
      sizeBytes: stats.size,
      success: true,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
    await server.close();
  }
}

const isDirectExecution =
  process.argv[1] && resolve(process.argv[1]) === resolve(__filename);

if (isDirectExecution) {
  generateStaticPdf()
    .then((result) => {
      console.log(
        `✅ [Playwright PDF] Successfully generated static A4 PDF (${(result.sizeBytes / 1024).toFixed(1)} KB):`
      );
      console.log(`   - ${result.path}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ [Playwright PDF] PDF generation failed:', err);
      process.exit(1);
    });
}
