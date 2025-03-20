# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-03-20

### Added

- Support for multiple data formats:
  - CSV with special handling for duplicate column names (parsed into arrays)
  - JSON data loading
  - YAML data loading
- EJS templating inside data fields, allowing fields to reference other fields in the same card
- HTML template rendering with EJS
- Helper functions for templates:
  - `hasImage()` to check if an image exists
  - `loadImage()` to convert images to base64 data URLs
  - `includeCSS()` to include and render CSS files
- Multiple output formats:
  - PNG export with customizable filenames
  - PDF export with multiple cards per page
- Comprehensive configuration options:
  - Command-line arguments
  - Configuration files (YAML/JSON)
  - Sensible defaults for all options
    - Industry-standard card dimensions (2.75×3.75 inches at 300 DPI)
- Documentation:
  - Usage guide with examples
  - Contributing guidelines
  - Attribution requirements
  - Example of cut zone and safe zone visualization
- Initial project structure
- NPM package metadata

[1.0.0]: https://github.com/8f00ff/cardelier/releases/tag/v1.0.0
