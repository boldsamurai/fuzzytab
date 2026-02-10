<p align="center">
  <img src="icons/icon.svg" width="80" height="80" alt="FuzzyMarks logo">
</p>

<h1 align="center">FuzzyMarks</h1>

<p align="center">
  A Firefox new tab replacement with lightning-fast fuzzy bookmark search, <a href="https://catppuccin.com">Catppuccin</a> themes, and full keyboard control.
</p>

<p align="center">
  <a href="https://ko-fi.com/boldsamurai"><img src="https://img.shields.io/badge/Ko--fi-Support%20me-ff5e5b?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Ko-fi"></a>
</p>

---

<!-- TODO: Add screenshots
## Screenshots

| Light | Dark |
|-------|------|
| ![Light theme](screenshots/light.png) | ![Dark theme](screenshots/dark.png) |
-->

## Features

### Search
- **Fuzzy search** powered by [fuzzysort](https://github.com/farzher/fuzzysort) — finds bookmarks by title or URL with match highlighting
- Configurable search scope (Title + URL, Title only, URL only)
- Folder name matching — shows all bookmarks inside matching folders

### Themes & Appearance
- **4 Catppuccin palettes** — Latte, Frappe, Macchiato, Mocha
- **14 accent colors** — rosewater, flamingo, pink, mauve, red, maroon, peach, yellow, green, teal, sky, sapphire, blue, lavender
- Custom color overrides with saveable presets
- Custom background image with opacity control
- Display density (compact / normal / spacious), content width, and font size sliders

### Bookmark Management
- Full tree view of all Firefox bookmarks with expand/collapse
- Create, edit, delete, and move bookmarks and folders
- Drag & drop reordering in the tree
- Duplicate URL detection when adding bookmarks
- Undo support for all destructive actions (Ctrl+Z)
- Right-click context menu on every item
- Open all bookmarks in a folder at once

### Pinned Bookmarks Bar
- Pin frequently used bookmarks to a bottom bar for quick access
- Drag & drop and keyboard reordering
- Configurable limit and icon size

### Keyboard Shortcuts
- **50+ shortcuts** covering navigation, bookmark management, and tools
- Fully customizable — record new bindings, detect conflicts, reset individually or all at once

<details>
<summary>Default shortcuts</summary>

#### Navigation
| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate up / down |
| `←` / `→` | Collapse / expand folder |
| `Enter` | Open bookmark / toggle folder |
| `Shift+Enter` | Open in new tab |
| `Ctrl+↑` / `Ctrl+↓` | Jump 5 items |
| `Home` / `End` | Jump to start / end |

#### Bookmark Management
| Shortcut | Action |
|----------|--------|
| `Ctrl+Alt+N` | New bookmark |
| `Ctrl+Alt+M` | New folder |
| `Ctrl+Alt+E` | Edit selected |
| `Ctrl+Alt+R` | Move selected |
| `Delete` | Delete selected |
| `Ctrl+Z` | Undo |
| `Alt+.` | Pin / unpin |

#### Tools
| Shortcut | Action |
|----------|--------|
| `Ctrl+Alt+F` | Focus search |
| `Escape` | Clear search |
| `Ctrl+Alt+S` | Statistics |
| `Ctrl+Alt+/` | Help |
| `Alt+S` | Settings |

</details>

### Statistics
- Total bookmarks, folders, unique domains, and visits
- Most visited bookmarks, largest folders, top domains — with configurable limits

### Data Management
- Export / import bookmarks (standard HTML format)
- Export / import settings (JSON backup)
- Reset visit counters, folder states, or pinned bookmarks independently

### Internationalization
- English and Polish — switch at runtime, no reload needed

## Installation

### Firefox
Install from [Firefox Add-ons (AMO)](https://addons.mozilla.org/firefox/addon/fuzzymarks/).

### Chrome / Edge / Brave
1. Run `bash build.sh` to generate the Chrome package, or download from Releases
2. Open `chrome://extensions` and enable **Developer mode**
3. Click **Load unpacked** and select the extracted Chrome build folder

## Building

```bash
bash build.sh
```

Generates two zip files in `dist/`:
- `fuzzymarks-firefox-<version>.zip` — Firefox (Manifest V3 + gecko settings)
- `fuzzymarks-chrome-<version>.zip` — Chrome/Chromium (Manifest V3)

## Tech Stack

- Vanilla JS — no frameworks, no build step
- [fuzzysort](https://github.com/farzher/fuzzysort) for fuzzy matching
- [Catppuccin](https://catppuccin.com) color palettes
- WebExtensions API (Manifest V3) — Firefox + Chrome/Chromium

## License

[MIT](LICENSE)

## Support

If you find FuzzyMarks useful, consider supporting me:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20me-ff5e5b?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/boldsamurai)
