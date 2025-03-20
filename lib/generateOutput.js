/**
 * @file generateOutput.js
 * @description Output generation for Cardelier.
 *
 * This module handles the generation of PNG and PDF output files from HTML templates.
 * It uses Puppeteer to render HTML cards to PNG images and to create PDF files
 * containing multiple cards arranged in a grid. The module provides functions for
 * creating browser pages, saving PNG files, and generating PDF output.
 *
 * @module generateOutput
 */

import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

import { generateHTML } from './generateHTML.js';

const cwd = process.cwd();

/**
 * Creates a new Puppeteer page with the specified HTML content and dimensions.
 *
 * @param {Object} browser - Puppeteer browser instance
 * @param {string} html - HTML content to load into the page
 * @param {number|null} width - Page width in pixels (optional)
 * @param {number|null} height - Page height in pixels (optional)
 * @returns {Promise<Object>} A promise that resolves to the created Puppeteer page
 */
async function createPage(browser, html, width = null, height = null) {
  const page = await browser.newPage();
  let viewport = {
    deviceScaleFactor: 1
  }
  if (width) {
    viewport['width'] = width;
  }
  if (height) {
    viewport['height'] = height;
  }
  await page.setViewport(viewport);
  await page.setContent(html);
  return page;
}

/**
 * Saves a Puppeteer page as a PNG image.
 *
 * Creates the output directory if it doesn't exist and saves the page
 * as a transparent PNG image.
 *
 * @param {Object} page - Puppeteer page to screenshot
 * @param {string} outPath - Path where the PNG file should be saved
 * @returns {Promise<void>} A promise that resolves when the PNG is saved
 */
async function savePNG(page, outPath) {
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  const screenshotBuffer = await page.screenshot({
    path: outPath,
    type: 'png',
    omitBackground: true
  });
  screenshotBuffer
}

/**
 * Generates a PDF file containing multiple card images arranged in a grid.
 *
 * This function creates a new page with a flex container and adds all card images
 * to it, respecting the quantity of each card. It then generates a PDF file
 * with the specified format, margins, and DPI.
 *
 * @param {Object} browser - Puppeteer browser instance
 * @param {string[]} screenshotBuffers64 - Array of base64-encoded PNG images
 * @param {number[]} quantities - Array of quantities for each card
 * @param {string} outPath - Path where the PDF file should be saved
 * @param {number} dpi - Resolution for PDF output in pixels per inch
 * @param {string} format - Page format for PDF output (e.g., 'Letter', 'A4')
 * @param {string} margin - Margin around the outside of the page
 * @returns {Promise<void>} A promise that resolves when the PDF is saved
 */
async function savePDF(browser, screenshotBuffers64, quantities, outPath, dpi, format, margin) {
  let gridPage;
  try {
    process.stdout.write('Generating PDF');
    
    gridPage = await browser.newPage();
    const gridHtml = '<html><body style="margin: 0; padding: 0; print-color-adjust: exact;"><div class="container" style="display: flex; flex-wrap: wrap; align-content: flex-start;"></body></html>';
    await gridPage.setContent(gridHtml);
    
    for (let i = 0; i < screenshotBuffers64.length; i++) {
      process.stdout.write('.');
      await gridPage.evaluate((screenshot, quantity) => {
        const containerDiv = document.getElementsByClassName("container")[0];
        for (let i = 0; i < quantity; i++) {
          containerDiv.innerHTML += `<img src="data:image/png;base64,${screenshot}">`;
        }
      }, screenshotBuffers64[i], quantities[i]);
    }
    
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    
    await gridPage.pdf({
      format: format,
      landscape: true,
      margin: {
        top: margin,
        right: margin,
        bottom: margin,
        left: margin
      },
      path: outPath,
      printBackground: true,
      scale: 96 / dpi
    });
    
  } catch(error) {
    process.stdout.write('\n');
    console.error(error);
    process.exit(1);
  } finally {
    if (gridPage && !gridPage.isClosed()) {
      await gridPage.close();
    }
  }
  process.stdout.write('\n');
}

/**
 * Main function to generate card output in PNG and/or PDF format.
 *
 * This function processes each card in the data array, renders it using the HTML template,
 * and generates the requested output formats (PNG files and/or a PDF file).
 *
 * @param {Object} config - Configuration object with output settings
 * @param {Array} data - Array of card data objects
 * @returns {Promise<void>} A promise that resolves when all output has been generated
 */
export async function generateOutput(config, data) {
  if (!config.png && !config.pdf) {
    console.warn("Warning: nothing to do.");
    process.exit(1);
  }
  
  let browser;
  try {
    let screenshotBuffers64 = [];
    let quantities = []
    
    browser = await puppeteer.launch({headless: true});
    
    for (let index = 0; index < data.length; index++) {
      let page;
      try {
        console.log(`Generating card ${data[index].name}..`);
        
        let template_data = {
          'card': data[index],
          'config': config,
          'index': index,
          'count': data.length
        };
        
        let html = generateHTML(config.template, template_data);
        page = await createPage(browser, html, config.width, config.height);
        
        if (config.png) {
          let pngFilename = ejs.render(config.pngFilename, template_data);
          let outPath = path.resolve(cwd, config.outDir, pngFilename);
          await savePNG(page, outPath);
        }
        
        if (config.pdf) {
          const screenshotBuffer = await page.screenshot({
            encoding: 'base64',
            type: 'png',
            omitBackground: true
          });
          screenshotBuffers64.push(screenshotBuffer.toString('base64'));
        }
        
        quantities.push(data[index][config.quantityKey] ?? 1);
        
      } catch(error) {
        console.error(error);
        process.exit(1);
      } finally {
        if (page && !page.isClosed()) {
          await page.close();
        }
      }
    }
    
    if (config.pdf) {
      let outPath = path.resolve(cwd, config.outDir, config.pdfFilename);
      await savePDF(browser, screenshotBuffers64, quantities, outPath, config.dpi, config.pdfFormat, config.pdfMargin);
    }
  } catch(error) {
    console.error(error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
