# FuzzyMarks — Project Reference

## Overview

FuzzyMarks is a browser extension (Firefox + Chrome, Manifest V3) that replaces the new tab page with a keyboard-driven bookmark manager featuring fuzzy search, Catppuccin themes, and full customization.

- **Version**: 1.0.4
- **GitHub**: https://github.com/boldsamurai/fuzzymarks
- **AMO**: Published and approved
- **Chrome Web Store**: Submitted
- **Ko-fi**: https://ko-fi.com/boldsamurai

## File Structure

```
fuzzymarks/
├── manifest.json           # Firefox Manifest V3 (with gecko settings)
├── manifest-chrome.json    # Chrome Manifest V3 (no gecko, no tabs permission)
├── newtab.html             # Single-page UI (589 lines) — all modals, panels, structure
├── newtab.js               # All application logic (4011 lines)
├── newtab.css              # All styles (1887 lines) — Catppuccin themes, components
├── i18n.js                 # Internationalization EN + PL (697 lines, 153 keys each)
├── browser-polyfill.js     # 3-line shim: window.browser = chrome (for Chrome)
├── fuzzysort.min.js        # Fuzzy search library v3.1.0 (bundled but currently UNUSED)
├── build.sh                # Packages Firefox + Chrome zips into dist/
├── icons/
│   ├── icon.svg            # Extension icon (lupa + diamond, Catppuccin colors)
│   └── icon-128.png        # PNG export of icon
├── .gitignore              # Ignores .DS_Store, *.bak, *.swp, dist/
├── README.md               # Project documentation
└── LICENSE                 # MIT
```

## Architecture

### Load Order
```
newtab.html
  → browser-polyfill.js   (Chrome compatibility shim)
  → i18n.js               (translations, t(), applyI18nToDom(), switchLanguage())
  → newtab.js             (all logic, calls init() as last statement)
```

### Initialization Flow (init() → line 414)
```
init()
  → loadSettings()            # storage.local.get('appSettings') → applySettings() + renderSettingsUI() + updateShortcutDisplays()
  → set currentLang from appSettings.language
  → applyI18nToDom()          # translate static DOM elements
  → applySettings()           # apply theme, CSS vars, placeholder (with correct language)
  → updateShortcutDisplays()  # button tooltips (with correct language)
  → loadFolderStates()        # storage.local.get('folderStates')
  → loadClickCounts()         # storage.local.get('clickCounts')
  → loadBackground()          # storage.local.get('backgroundImage')
  → loadPinnedBookmarks()     # storage.local.get('pinnedBookmarks')
  → loadBookmarks()           # browser.bookmarks.getTree() → flattenBookmarks()
  → renderBookmarksTree()     # full DOM render of bookmark tree
  → renderPinnedBar()         # render pinned bookmarks bar
```

### Key Design Patterns
- **No build step** — vanilla JS, loaded directly by browser
- **Single-file logic** — newtab.js is monolithic, no modules
- **DOM-based state** — folder open/closed via CSS classes, mirrored in `folderStates` object
- **Full re-render strategy** — most mutations trigger `renderBookmarksTree()` (full DOM rebuild)
- **Dual selection model** — `selectedIndex` (main tree) + `selectedPinnedIndex` (pinned bar)
- **Delta-based shortcuts** — custom shortcuts stored as overrides on top of `DEFAULT_SHORTCUTS`
- **i18n via labelKey pattern** — data structures use `labelKey`/`titleKey` instead of `label`/`title`, resolved at render time via `t()`

## Storage Schema (browser.storage.local)

| Key | Type | Format |
|-----|------|--------|
| `appSettings` | Object | Same shape as `DEFAULT_SETTINGS` (see below) |
| `clickCounts` | Object | `{ "https://url": visitCount, ... }` |
| `folderStates` | Object | `{ "folderId": true/false, ... }` |
| `pinnedBookmarks` | Array | `["bookmarkId1", "bookmarkId2", ...]` |
| `backgroundImage` | String | Base64 data URL `"data:image/...;base64,..."` |

### Settings Export JSON Format
```json
{
  "version": 1,
  "exportedAt": "ISO date string",
  "appSettings": { ... },
  "clickCounts": { ... },
  "folderStates": { ... },
  "pinnedBookmarks": [ ... ]
}
```

## DEFAULT_SETTINGS (line 115-149)

```javascript
{
  language: 'en',                    // 'en' | 'pl'
  theme: 'macchiato',                // 'latte' | 'frappe' | 'macchiato' | 'mocha'
  accentColor: 'mauve',             // one of 14 ACCENT_COLORS
  customColors: {},                  // { colorKey: '#hex' }
  colorPresets: [],                  // [{ name, theme, accentColor, customColors }]
  savedPreset: null,                 // { name, theme, accentColor, customColors } or null
  bgOpacity: 0.3,                   // 0-1, step 0.05
  density: 'normal',                // 'compact' | 'normal' | 'spacious'
  contentMaxWidth: 800,             // 600-1200 px
  searchFontSize: 18,               // 14-24 px
  showVisitCount: true,
  doubleClickToOpen: false,
  middleClickNewTab: true,
  folderStartState: 'remembered',   // 'remembered' | 'collapsed' | 'expanded'
  shortcuts: {},                     // { shortcutId: { key, ctrl, alt, shift } }
  searchDebounce: 100,              // 0-500 ms
  searchScope: 'both',             // 'both' | 'title' | 'url'
  searchPlaceholder: '',            // empty = use translated default
  pinnedLimit: 10,                   // 3-20
  pinnedShowEmpty: false,
  pinnedIconSize: 'normal',         // 'small' | 'normal' | 'large'
  statsTopVisited: 10,              // 3-25
  statsTopFolders: 8,               // 3-20
  statsTopDomains: 8,               // 3-20
  showHelpButton: true,
  showStatsButton: true,
  showAddButton: true,
  showBgButton: true,
  buttonsPosition: 'bottom-right',  // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  buttonsOrder: ['help', 'stats', 'add', 'settings', 'bg'],
  warnDuplicateUrl: true,
  openAllThreshold: 5,              // 0-30 (0 = no confirmation)
  defaultFolderStates: {}           // { folderId: true/false }
}
```

## Data Structures

### THEMES (line 45-98)
4 Catppuccin themes, each with `name`, `labelKey`, and `colors` object containing all 26 tokens:
`rosewater, flamingo, pink, mauve, red, maroon, peach, yellow, green, teal, sky, sapphire, blue, lavender, text, subtext1, subtext0, overlay2, overlay1, overlay0, surface2, surface1, surface0, base, mantle, crust`

### ACCENT_COLORS (line 101-104)
Array of 14 color names from Catppuccin palette.

### COLOR_GROUPS (line 107-112)
4 groups for custom color editor: background (base/mantle/crust), surfaces, overlays, text.

### SHORTCUT_CATEGORIES (line 194-237)
4 categories: navigation (10), management (9), tools (7), pinned (8) = 34 shortcuts total.
Each shortcut: `{ id: string, labelKey: string }`.

### ROOT_FOLDER_KEYS (line 3385-3390)
Maps Firefox internal folder IDs to i18n keys:
- `toolbar_____` → `folder.toolbar`
- `menu________` → `folder.menu`
- `unfiled_____` → `folder.unfiled`
- `mobile______` → `folder.mobile`

## Global State Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `allBookmarks` | Array | Flattened bookmark list `[{id, title, url, folderId, folderPath}]` |
| `clickCounts` | Object | Visit counter per URL |
| `folderStates` | Object | Folder open/closed states |
| `currentQuery` | string | Active search query |
| `selectedIndex` | number | Selected item in main tree (-1 = none) |
| `selectedPinnedIndex` | number | Selected pinned item (-1 = not in pinned mode) |
| `savedSelectedIndex` | number | Saved main selection when entering pinned mode |
| `visibleBookmarks` | Array | Currently visible DOM elements for keyboard nav |
| `pinnedBookmarks` | Array | Pinned bookmark IDs |
| `appSettings` | Object | Current merged settings |
| `undoStack` | Array | In-memory undo history (not persisted) |
| `pendingBookmark` | Object/null | Bookmark waiting for duplicate resolution |
| `currentBookmarkElement` | Element/null | DOM element being acted on |
| `currentBookmarkId` | string/null | Bookmark ID being acted on |
| `currentItemIsFolder` | boolean | Whether current item is folder |
| `draggedElement` | Element/null | Currently dragged element |
| `recordingShortcutId` | string/null | Shortcut being recorded |

## Undo System

In-memory `undoStack` (not persisted). Supports:

| Type | Undo Action |
|------|-------------|
| `delete-bookmark` | Recreate bookmark at original position |
| `delete-folder` | Recursively recreate folder + all children |
| `move` | Move back to original parent + index |
| `edit-bookmark` | Restore old title + URL |
| `edit-folder` | Restore old title |
| `create-bookmark` | Remove created bookmark |
| `create-folder` | Remove created folder tree |
| `pin` | Unpin bookmark |
| `unpin` | Re-pin at original position |

## CSS Architecture

### Custom Properties (set dynamically by applySettings())
- `--ctp-{colorName}` — 26 Catppuccin color tokens
- `--ctp-accent` — current accent color
- `--bg-opacity` — background image opacity (0-1)
- `--content-max-width` — content width in px
- `--search-font-size` — search input font size in px

### Font
```css
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Body Classes
- `density-compact` / `density-normal` / `density-spacious`
- `hide-visit-count` — hides `.visit-count` elements
- `pinned-mode` — dims main selection when navigating pinned bar
- `pinned-show-empty` — shows empty pinned bar with hint
- `pinned-size-small` / `pinned-size-large`

### Floating Buttons Position Classes
- `.pos-top-left` / `.pos-top-right` / `.pos-bottom-left` (default: bottom-right)

### Folder Animation
CSS Grid trick: `grid-template-rows: 0fr → 1fr` with 0.5s transition.

### Settings Layout
Two-column: sidebar nav (180px) + content panel. Tab switching via `.settings-panel.active`.

## i18n System

### How It Works
- `i18n.js` loaded before `newtab.js`, defines globals
- `TRANSLATIONS` object with `en` and `pl` keys, 153 entries each
- `t(key, params)` — lookup with fallback: currentLang → en → return key
- Interpolation: `{count}`, `{shortcut}`, `{label}`, `{message}`
- `data-i18n="key"` on HTML elements → `applyI18nToDom()` sets textContent
- `data-i18n-attr="attr:key"` → sets attribute values (placeholder, title)

### Language Switch Flow
```
switchLanguage(lang)
  → update currentLang + appSettings.language
  → saveSettings()
  → applyI18nToDom()           # static DOM
  → applySettings()            # search placeholder
  → renderSettingsUI()         # settings panel
  → updateShortcutDisplays()   # button tooltips
  → renderBookmarksTree()      # tree with visit counts
  → renderPinnedBar()          # pinned bar
```

### Translation Key Prefixes
`btn.*`, `add.*`, `ctx.*`, `modal.delete.*`, `modal.edit.*`, `modal.move.*`, `modal.newBookmark.*`, `modal.newFolder.*`, `modal.duplicate.*`, `modal.stats.*`, `modal.help.*`, `settings.*`, `theme.*`, `colors.*`, `shortcuts.cat.*`, `shortcut.*`, `button.*`, `folder.*`, `confirm.*`, `alert.*`, `stats.*`, `tree.*`, `presets.*`, `duplicate.*`, `error.*`, `position.*`, `search.*`

## Build System

`build.sh` packages two zips into `dist/`:
- `fuzzymarks-firefox-<version>.zip` — uses `manifest.json` (with gecko settings, tabs permission)
- `fuzzymarks-chrome-<version>.zip` — uses `manifest-chrome.json` (no gecko, no tabs permission)

Version extracted automatically from `manifest.json`.

### Manifest Differences
| | Firefox | Chrome |
|---|---------|--------|
| `browser_specific_settings.gecko` | Present (id, min_version, data_collection) | Absent |
| `tabs` permission | Included | Removed (not needed in Chrome) |

## External Dependencies

| Dependency | Status | Purpose |
|-----------|--------|---------|
| fuzzysort v3.1.0 | **Bundled but UNUSED** — search uses `String.includes()` | Planned fuzzy matching |
| Google Favicons | Runtime, external | `https://www.google.com/s2/favicons?domain=...&sz=32` |
| Catppuccin | Hardcoded in THEMES | Color palettes |

## DOM Structure Overview

```
body
  #background                    — full-page background image
  .search-section                — fixed top, search input
  .bookmarks-section             — scrollable, bookmark tree
  #pinned-bar                    — fixed bottom, pinned bookmarks
  #floating-buttons              — positioned corner buttons (help, stats, add, settings, bg)
  #bg-input                      — hidden file input
  #context-menu                  — right-click menu (8 items)
  #modal-overlay                 — modal backdrop + all modals:
    #delete-modal
    #edit-modal
    #move-modal
    #new-bookmark-modal
    #new-folder-modal
    #duplicate-modal
    #stats-modal
    #help-modal
    #settings-modal              — tabbed: appearance, navigation, shortcuts, search, pinned, ui, data
```

## Key Functions Reference

### Core
- `init()` :414 — initialization sequence
- `loadSettings()` :2924 / `saveSettings()` :2938
- `applySettings()` :2946 — apply theme, CSS vars, density, buttons
- `renderBookmarksTree()` :868 — full DOM render of tree
- `renderPinnedBar()` :502 — render pinned bar
- `renderSettingsUI()` :3015 — sync all settings controls

### Bookmark Operations
- `openBookmark(url)` :830 / `openBookmarkInNewTab(url)` :837
- `openAllInFolder(folderId)` :844
- `flattenBookmarks(node, folderId, folderPath)` :794
- `renderFolder(node, depth)` :919 — recursive HTML generation
- `filterTree(query)` :1268 — search filtering via CSS classes

### Modals
- `showModal(modal)` :1809 / `hideModal()` :1816
- `showDeleteConfirm()` :1836 / `confirmDelete()` :1871
- `showEditModal()` :1909 / `confirmEdit()` :1938
- `showMoveModal()` :2003 / `confirmMove(placementMode)` :2162
- `showNewBookmarkModal()` :2234 / `confirmNewBookmark(forceAdd)` :2254
- `showNewFolderModal()` :2361 / `confirmNewFolder()` :2406
- `showDuplicateWarning()` :2311
- `showStats()` :2782 / `showHelp()` :2913 / `showSettings()` :3985

### Utilities
- `escapeHtml(str)` :1371
- `normalizeUrl(url)` :1379
- `findDuplicates(url)` :1396
- `getFaviconUrl(url)` :820
- `getShortcuts()` :240 / `matchesShortcut(e, def)` :244 / `formatShortcut(def)` :251
- `getRootFolderName(id)` :3392 / `getButtonLabel(id)` :3524
- `undo()` :340

### i18n (from i18n.js)
- `t(key, params)` :633
- `applyI18nToDom()` :657
- `switchLanguage(lang)` :682

## Known Issues / Technical Debt

1. **fuzzysort is bundled but unused** — `filterTree()` uses `String.includes()` instead. Either integrate fuzzysort or remove the file.
2. **innerHTML usage** — 35+ locations use innerHTML for rendering. AMO flags as warnings but all user data is escaped via `escapeHtml()`. Safe but verbose.
3. **Monolithic JS** — 4000+ lines in single file. Works fine but harder to navigate. No module system.
4. **Full re-renders** — Most bookmark operations trigger full `renderBookmarksTree()`. Could be optimized with partial DOM updates.
5. **Search placeholder migration** — Old saved value `'Search bookmarks...'` is treated as "no custom placeholder" to support i18n fallback. Checks for both EN and PL default strings.
