[![Cardelier](https://img.shields.io/badge/Cardelier-7f00ff)](https://github.com/8f00ff/cardelier)

[<img src="https://raw.githubusercontent.com/ZoeBijl/QueerCats/refs/heads/main/MorningCoffee/SVG/QueerCatMorningCoffee_Progress.svg" width="48" height="48" alt="Morning Pride Cat"/>](https://github.com/ZoeBijl/QueerCats)

## Overview

Cardelier is a handy command-line tool that generates cards from HTML/CSS+EJS layouts and your data files (CSV, JSON, or YAML). It's designed to make life easier when creating card assets for games, trading cards, prototypes, or educational materials - basically anything where you need lots of similar-looking cards without the tedious work.

Born from a love of [Squib](https://squib.rocks), but reimagined for those of us who feel more at home with web technologies.

### Key Features

- **Flexible Data Sources**: Import card data from CSV, JSON, or YAML files
- **Customizable Templates**: Design cards using HTML, CSS and EJS templating
- **Multiple Output Formats**: Export cards as individual PNG images or combined PDF documents
- **Image Integration**: Easily include images in your card designs
- **Batch Processing**: Generate multiple cards in a single command
- **Configurable Options**: Control dimensions, resolution, file naming, and other settings

## Usage

See the [USAGE.md](USAGE.md).

## Installation

Install Cardelier from npm globally to use it as a command-line tool:

```bash
npm install -g cardelier
```

This makes the `cardelier` command available system-wide.

## Building

### Prerequisites

- `npm` - Node Package Manager
- Node.js (v16 or higher recommended)
- The following dependencies will be installed automatically:
  - `puppeteer` - For rendering HTML to PNG/PDF
  - `ejs` - For templating
  - `papaparse` - For CSV parsing
  - `js-yaml` - For YAML parsing
  - `yargs` - For command-line argument handling

#### System-specific requirements for Puppeteer

Puppeteer requires Chrome/Chromium to be installed. On some systems, you may need additional dependencies.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/8f00ff/cardelier.git
   cd cardelier
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a symbolic link to make the package available globally (optional):
   ```bash
   npm link
   ```

4. Test the installation:
   ```bash
   cardelier --help
   ```

5. To use the included example project:
   ```bash
   cd project
   cardelier
   ```
   This will generate cards based on the example template and data in the `project` directory.

## Changelog

[![GitHub Tag](https://img.shields.io/github/v/tag/8f00ff/cardelier)](https://github.com/8f00ff/cardelier/tags)
[![NPM Version](https://img.shields.io/npm/v/cardelier)](https://www.npmjs.com/package/cardelier)

See the [CHANGELOG.md](CHANGELOG.md) file for a detailed list of changes.

## Contributing

See the [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

[![GitHub License](https://img.shields.io/github/license/8f00ff/cardelier)](LICENSE.md)

This project is licensed under [GNU Lesser General Public License (LGPL-3.0)](https://www.gnu.org/licenses/lgpl-3.0.en.html) - see the [LICENSE.md](LICENSE.md) file for details.

This project also has specific attribution requirements - see the [Attribution Requirements](CONTRIBUTING.md#attribution-requirements) section of the [Contributing Guidelines](CONTRIBUTING.md).

## Attributions

For attribution information including third-party assets and tools used in this project, see [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
