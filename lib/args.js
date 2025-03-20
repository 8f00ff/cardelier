/**
 * @file args.js
 * @description Command-line argument parsing for Cardelier.
 *
 * This module handles the configuration and parsing of command-line arguments
 * for the Cardelier card generation tool. It defines default values, argument types,
 * and descriptions for all supported options. It also handles loading configuration
 * from external files (YAML/JSON).
 *
 * @module args
 */

import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { parseDataSync } from './parseData.js';

const argOptions = {
  'config': {
    'description': 'Path to config file',
    'type': 'string',
    'default': 'config.yml'
  },
  'data': {
    'description': 'Path to data file',
    'type': 'string',
    'default': 'data.csv'
  },
  'dpi': {
    'description': 'Resolution for PDF output in pixels per inch',
    'type': 'number',
    'default': 300
  },
  'pdf': {
    'description': 'Export cards as a PDF file',
    'type': 'boolean',
    'default': false
  },
  'png': {
    'description': 'Export cards as PNG files',
    'type': 'boolean',
    'default': true
  },
  'height': {
    'description': 'Card height in pixels',
    'type': 'number',
    'default': 1125
  },
  'img-dir': {
    'description': 'Folder to search for image files',
    'type': 'string',
    'default': 'img'
  },
  'out-dir': {
    'description': ' Folder to save output to',
    'type': 'string',
    'default': 'out'
  },
  'pdf-format': {
    'description': 'Page format for PDF output',
    'type': 'string',
    'default': 'Letter',
    'choices': ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'Ledger', 'Legal', 'Letter', 'Tabloid']
  },
  'pdf-margin': {
    'description': 'Margin around the outside of the page',
    'type': 'string',
    'default': '37.5px'
  },
  'pdf-filename': {
    'description': 'Filename for PDF file',
    'type': 'string',
    'default': 'cards.pdf'
  },
  'png-filename': {
    'description': 'Filename template for PNG filenames',
    'type': 'string',
    'default': 'card_<%=card.id%>.png'
  },
  'quantity-key': {
    'description': 'Data key to use for quantities',
    'type': 'string',
    'default': 'quantity'
  },
  'template': {
    'description': 'Path to HTML template file',
    'type': 'string',
    'default': 'template.html'
  },
    'width': {
    'description': 'Card width in pixels',
    'type': 'string',
    'default': 825
  }
}

/**
 * Loads and parses a configuration file from the specified path.
 *
 * @param {string} filePath - Path to the configuration file (YAML or JSON)
 * @returns {Object} The parsed configuration object, or an empty object if the file doesn't exist
 */
function loadConfigFile(filePath) {
  let config = {};
  if (fs.existsSync(filePath)) {
    config = parseDataSync(filePath);
  }
  return config;
}

/**
 * Parses command-line arguments using yargs.
 *
 * This function configures yargs with the defined argument options,
 * loads any specified config file, and returns the parsed arguments.
 *
 * @returns {Promise<Object>} A promise that resolves to the parsed command-line arguments
 */
export async function parseArgs(commandGenerate) {
  return yargs(hideBin(process.argv))
    .options(argOptions)
    .config('config', loadConfigFile)
    .describe('config', argOptions.config.description)
    .usage('$0 <command> [<args>]')
    .command('generate', 'Generate cards', (yargs) => {
      return yargs;
    }, (argv) => {
      commandGenerate(argv);
    })
    .demandCommand()
    .help().alias('help', 'h')
    .parse();
}
