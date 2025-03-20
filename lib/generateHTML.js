/**
 * @file generateHTML.js
 * @description HTML generation from templates and data for Cardelier.
 *
 * This module handles the generation of HTML content from EJS templates and card data.
 * It provides helper functions for including CSS, checking for image existence,
 * and loading images as base64-encoded data URLs. The generated HTML represents
 * individual cards that will be rendered to PNG or PDF.
 *
 * @module generateHTML
 */

import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { exit } from 'process';

const cwd = process.cwd();

/**
 * Reads a CSS file, wraps it in style tags, and renders it with EJS.
 *
 * @param {string} filePath - Path to the CSS file
 * @param {Object} data - Data object to use for EJS rendering
 * @returns {string} The CSS content wrapped in style tags and rendered with EJS
 */
function includeCSS(filePath, data) {
  let template = fs.readFileSync(filePath, 'utf8');
  template = `<style>${template}</style>`;
  return ejs.render(template, data);
}

/**
 * Checks if an image file exists at the specified path.
 *
 * @param {string} filePath - Relative path to the image file
 * @param {string} baseDir - Base directory for image files (default: '.')
 * @returns {boolean} True if the image exists and is a file, false otherwise
 */
function hasImage(filePath, baseDir = '.') {
  if (!filePath) {
    return false;
  }
  const imagePath = path.resolve(cwd, baseDir, filePath);
  if (!fs.existsSync(imagePath)) {
    return false;
  }
  const stats = fs.statSync(imagePath);
  return stats.isFile();
}

/**
 * Loads an image file and converts it to a base64-encoded data URL.
 *
 * @param {string} filePath - Relative path to the image file
 * @param {string} baseDir - Base directory for image files (default: '.')
 * @returns {string} The image as a base64-encoded data URL
 * @throws {Error} If the file doesn't exist or is a directory
 */
function loadImage(filePath, baseDir = '.') {
  if (!filePath) {
    throw new Error(`Invalid file path provided: ${filePath}`);
  }
  const imagePath = path.resolve(cwd, baseDir, filePath);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`File not found at path: ${imagePath}`);
  }
  const stats = fs.statSync(imagePath);
  if (!stats.isFile()) {
    throw new Error(`Found a directory at path: ${imagePath}`);
  }
  
  let imageExtension = path.extname(imagePath).slice(1);
  if (imageExtension.toLocaleLowerCase() == 'svg') {
    imageExtension += '+xml';
  }
  
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  return `data:image/${imageExtension};base64,${base64Image}`;
}

/**
 * Generates HTML for a card using an EJS template and card data.
 *
 * This function adds helper functions to the data object for use in templates:
 * - hasImage: Check if an image exists
 * - loadImage: Load an image as a data URL
 * - includeCSS: Include and render CSS content
 *
 * It also processes any EJS templates in the card description field.
 *
 * @param {string} filePath - Path to the EJS template file
 * @param {Object} data - Data object containing card data and configuration
 * @returns {string} The rendered HTML for the card
 */
export function generateHTML(filePath, data) {
  data['hasImage'] = (filePath) => {
    return hasImage(filePath, data.config.imgDir)
  };
  data['loadImage'] = (filePath) => {
    return loadImage(filePath, data.config.imgDir)
  };
  data['includeCSS'] = (filePath) => {
    return includeCSS(filePath, data);
  };
  
  for (const i in data.card) {
    const value = data.card[i];
    if (value != null && typeof value == "string") {
      delete data.card[i];
      data.card[i] = ejs.render(value, data.card);
    }
  }
  
  const template = fs.readFileSync(filePath, 'utf8');
  const html = ejs.render(template, data);
  
  return html
}
