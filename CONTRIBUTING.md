# Contributing to Cardelier

*Greetings, card crafter!*

You've found the Cardelier Guild Hall! Whether you banish bugs, enhance our documentation scrolls, or forge new enchantments, your magic is welcome here!

Tag your spells, test before casting, and document anything that might confuse the next wizard who reads your code-craft!

Remember: Even archmages started as apprentices who couldn't center a div!

~The Cardelier Council, *shuffles deck*

## The Basics

- **Found a bug?** Open an issue with a clear description and steps to reproduce
- **Fixed a bug?** Submit a pull request referencing the issue
- **Adding a feature?** Open an issue to discuss it first before coding
- **Have questions?** Use GitHub discussions rather than issues

## Getting Started

1. Fork the repository
2. Clone your fork:
    
    ``` bash
    git clone https://github.com/username/cardelier.git
    ```
    
3. Create a branch:
    
    ``` bash
    git checkout -b fix-awesome-bug
    ```
    
4. Make your changes
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/).
6. Push to your fork:
    
    ``` bash
    git push origin fix-awesome-bug
    ```
    
7. Submit a pull request!

## Development Process

- Follow our [Git Workflow](https://github.com/8f00ff/knowledge-base/blob/main/Git/Git%20Workflow.md) guidelines
- Write tests for your changes
- Update documentation if needed
- Be kind and respectful in all interactions

## Code Style

We strive for clean, maintainable, and well-documented code in Cardelier:

- **JavaScript**: Follow standard ES6+ practices with emphasis on readability
- **Documentation**: Use JSDoc for all functions and modules
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings unless the string contains single quotes
- **Naming**:
  - Use camelCase for variables and functions
  - Use PascalCase for classes
  - Use UPPER_SNAKE_CASE for constants
- **Comments**: Explain "why" not "what" - code should be self-explanatory for the "what"
- **Testing**: Write tests for all new functionality
- **Functions**: Keep functions small and focused on a single responsibility
- **Error handling**: Properly handle and provide meaningful error messages

## Project Structure

- `lib/` - Core functionality divided into modules
- `bin/` - Executable scripts
- `package.json` - Project metadata

## Attribution Requirements

This project follows specific attribution guidelines that MUST be maintained in all derivatives and forks.

### [ATTRIBUTIONS.md](ATTRIBUTIONS.md) Structure

#### Maintainers

Current active maintainers only. Original authors should NOT be listed here unless actively maintaining this fork. Temporary PR forks (intended to be merged & deleted) don't need to modify this section, but long-term or permanent forks MUST update it to reflect actual maintainers.

#### Original Authors

Original creators of the project. This section MUST remain intact and unmodified in ALL derivatives and forks.

#### Additional Contributors

All original contributors MUST be kept, new ones may be appended. PR authors should add themselves here.

#### Supporters

All original supporters MUST be preserved, new ones may be appended.

#### Third-Party Assets & Libraries

All third-party assets, libraries, and tools used by the project. Each entry MUST include:
- Name with link to source
- Brief description of the asset/tool
- License information in parentheses

All entries MUST remain in this section as long as the corresponding asset or library is being used in any part of the project. New dependencies should be appended as they are added. When a dependency is removed, its entry may be removed from this section, as git history preserves the attribution record.

### Donation Links Policy

- Original creator donation/support links, if any exist, MUST always be maintained in all derivatives.
- Derivative works may include their own donation/support links.
- Derivative creator links may be positioned above original creator links, but original links must remain present and functional.

### Fork Responsibility

- Original authors reserve the right to request correction of attribution in any fork that misrepresents maintainer status.
- "PR-only" forks that become long-term projects MUST update the Maintainers section to accurately reflect who is actively maintaining the fork.

**Using this project constitutes agreement to follow these attribution guidelines.**

## Questions?

Feel free to open a discussion if you have any questions!
