# Changelog

All notable changes to **Console Remover for VS Code** will be documented in this file.  
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] – 2025-11-04

### Added

- Command **Console Remover: Remove consoles from current file**.
- Command **Console Remover: Remove consoles from entire workspace**.
- AST-based console removal using Babel for safe code transformations.
- Support for JavaScript and TypeScript (`.js`, `.jsx`, `.ts`, `.tsx`).
- Automatic file saving after modifications.
- Progress notifications for workspace-wide operations.
- No default keybindings; user-configurable shortcuts.
- Documentation (`README.md`) and packaging instructions.

---

## [Unreleased]

### Planned

- Option to keep specific console types (e.g., only remove `console.log`).
- Dry-run mode to preview changes before writing files.
- Add backup or git-commit-before-change option.
- Custom include/exclude globs for workspace cleanup.
