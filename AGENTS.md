# Repository Guidelines

## Project Structure & Module Organization
This repository contains a browser extension implemented separately for Chromium and Firefox targets.
- `chrome/`: Chrome/Edge build (Manifest V3) with `manifest.json`, `background.js`, `sidepanel.html`, `sidepanel.css`, and `sidepanel.js`.
- `firefox/`: Firefox build with matching file layout for parity.
- Root assets: `logo.png`, `screenshot.png`, and `LICENSE`.

When adding a feature, update both `chrome/` and `firefox/` unless the behavior is intentionally browser-specific.

## Build, Test, and Development Commands
There is no package-based build pipeline in this repo.
- `xdg-open chrome://extensions/` then **Load unpacked** and select `chrome/`.
- `about:debugging#/runtime/this-firefox` then **Load Temporary Add-on** and select `firefox/manifest.json`.
- `zip -r text-case-converter-plus-chrome.zip chrome/` creates a distributable Chromium archive.
- `zip -r text-case-converter-plus-firefox.zip firefox/` creates a Firefox archive (or use `.xpi` naming for releases).

## Coding Style & Naming Conventions
- Use 2-space indentation and semicolons in JavaScript.
- Prefer `const` by default, `let` only when reassignment is required.
- Use camelCase for variables/functions (`loadFromStorage`), uppercase snake case for constants (`MOON_SVG`).
- Keep file names lowercase and aligned across browsers (`sidepanel.js`, `background.js`).
- Preserve feature parity by porting logic changes to both browser directories.

## Testing Guidelines
No automated test suite is currently configured. Validate changes manually:
1. Load both extensions.
2. Verify each transformation button (`upper`, `lower`, `sentence`, `title`, `alternating`, `random`).
3. Confirm storage persistence, clear behavior, copy action, and theme toggle.
4. Check browser console for runtime errors.

If adding automated tests later, place them under a top-level `tests/` directory and use `*.test.js` naming.

## Commit & Pull Request Guidelines
Recent history follows concise Conventional Commit style, especially `docs: ...`.
- Prefer prefixes like `feat:`, `fix:`, `docs:`, `refactor:`.
- Keep each commit scoped to one logical change.

PRs should include:
- What changed and why.
- Linked issue (if available).
- Manual test evidence for Chrome and Firefox.
- Updated screenshots when UI behavior changes.
