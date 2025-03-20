/**
 * @file parseData.js
 * @description Data parsing utilities for Cardelier.
 *
 * This module provides functions for parsing different data file formats
 * (CSV, JSON, YAML) into JavaScript objects that can be used to generate cards.
 * It handles type conversion, empty values, and special CSV processing.
 *
 * @module parseData
 */

import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * Synchronously parses data from YAML or JSON files.
 *
 * This function determines the file type based on the file extension
 * and calls the appropriate parser function.
 *
 * @param {string} filePath - Path to the data file
 * @returns {Object|Array|null} Parsed data object or array, or null if the file type is not supported
 */
export function parseDataSync(filePath) {
  const fileExtension = path.extname(filePath).slice(1);
  switch (fileExtension.toLowerCase()) {
    case 'yml':
    case 'yaml':
      return parseYAML(filePath);
    case 'json':
      return parseJSON(filePath);
  }
  return null;
}

/**
 * Asynchronously parses data from CSV, YAML, or JSON files.
 *
 * This function determines the file type based on the file extension
 * and calls the appropriate parser function. CSV parsing is handled
 * asynchronously, while YAML and JSON are parsed synchronously.
 *
 * @param {string} filePath - Path to the data file
 * @returns {Promise<Object|Array|null>} Promise resolving to parsed data object or array,
 *                                       or null if the file type is not supported
 */
export async function parseData(filePath) {
  const fileExtension = path.extname(filePath).slice(1);
  switch (fileExtension.toLowerCase()) {
    case 'csv':
      return await parseCSV(filePath);
    case 'json':
    case 'yml':
    case 'yaml':
      return parseDataSync(filePath);
  }
  return null;
}

/**
 * Parses a CSV file into an array of data objects.
 *
 * This function handles several CSV-specific processing steps:
 * 1. Parses the CSV with headers
 * 2. Processes renamed headers (duplicate column names)
 * 3. Converts values to appropriate types (boolean, number)
 * 4. Removes empty values and empty objects
 *
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} Promise resolving to an array of data objects
 */
export async function parseCSV(filePath) {
  const parsed = Papa.parse(fs.readFileSync(filePath, 'utf8'), {
    header: true
  });
  
  if (parsed.meta.renamedHeaders) {
    
    for (const row of parsed.data) {
      let data = {};
      
      for (const [k, v] of Object.entries(parsed.meta.renamedHeaders)) {
        if (!row[v]) {
          continue;
        }
        
        if (!data[v]) {
          data[v] = [];
          if (row[v]) {
            data[v].push(row[v]);
          }
        }
        if (row[k]) {
          data[v].push(row[k]);
        }
        
        delete row[k];
      }
      
      for (const [k, v] of Object.entries(data)) {
        row[k] = v;
      }
    }
    
  }
  
  for (const row of parsed.data) {
    for (const [k, v] of Object.entries(row)) {
      if (!v) {
        delete row[k];
      } else
      if (v == 'TRUE') {
        row[k] = true;
      } else
      if (v == 'FALSE') {
        row[k] = false;
      } else
      if (!isNaN(v)) {
        row[k] = Number(v);
      }
    }
  }
  
  const result = parsed.data.filter((i) => {
    return i !== null && typeof i === 'object' && Object.keys(i).length != 0;
  });
  
  return result;
}

/**
 * Parses a YAML file into a JavaScript object.
 *
 * @param {string} filePath - Path to the YAML file
 * @returns {Object|Array} Parsed YAML data
 */
export function parseYAML(filePath) {
  let result = yaml.load(fs.readFileSync(filePath, 'utf8'));
  
  return result;
}

/**
 * Parses a JSON file into a JavaScript object.
 *
 * @param {string} filePath - Path to the JSON file
 * @returns {Object|Array} Parsed JSON data
 */
export function parseJSON(filePath) {
  let result = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  return result;
}
