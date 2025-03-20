#!/usr/bin/env node
/**
 * @file cli.js
 * @description Main entry point for the Cardelier card generation tool.
 *
 * Cardelier is a command-line tool that generates cards from HTML/CSS+EJS layouts
 * and CSV/JSON/YAML data. This file orchestrates the entire card generation process:
 * 1. Parse command-line arguments
 * 2. Load and parse data from the specified file
 * 3. Generate output files (PNG and/or PDF)
 *
 * @author Vi (8f00ff)
 * @module cardelier
 */

import { parseArgs } from '../lib/args.js';
import { parseData } from '../lib/parseData.js';
import { generateOutput } from '../lib/generateOutput.js';

/**
 * Main function that executes the card generation process.
 *
 * This function coordinates the three main steps of the card generation process:
 * 1. Parse command-line arguments using the args module
 * 2. Load and parse data from the specified file using the parseData module
 * 3. Generate output files (PNG and/or PDF) using the generateOutput module
 *
 * @returns {Promise<void>} A promise that resolves when card generation is complete
 */
async function main() {
  const args = await parseArgs(generate);
}

async function generate(args) {
  const data = await parseData(args.data);
  await generateOutput(args, data);
}

await main().catch(console.error);
