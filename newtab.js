// State
let allBookmarks = [];
let clickCounts = {};
let folderStates = {};
let currentQuery = '';
let selectedIndex = -1;
let savedSelectedIndex = -1; // Saved when entering pinned mode
let visibleBookmarks = [];
let pinnedBookmarks = []; // Array of bookmark IDs
let selectedPinnedIndex = -1; // -1 means not in pinned bar

// DOM Elements
const searchInput = document.getElementById('search-input');
const bookmarksTree = document.getElementById('bookmarks-tree');
const bgButton = document.getElementById('bg-button');
const bgInput = document.getElementById('bg-input');
const background = document.getElementById('background');
const contextMenu = document.getElementById('context-menu');
const modalOverlay = document.getElementById('modal-overlay');
const deleteModal = document.getElementById('delete-modal');
const editModal = document.getElementById('edit-modal');
const moveModal = document.getElementById('move-modal');
const newBookmarkModal = document.getElementById('new-bookmark-modal');
const newFolderModal = document.getElementById('new-folder-modal');
const duplicateModal = document.getElementById('duplicate-modal');
const addButton = document.getElementById('add-button');
const addMenu = document.getElementById('add-menu');
const pinnedBar = document.getElementById('pinned-bar');
const pinnedBookmarksContainer = document.getElementById('pinned-bookmarks');
const bookmarksSection = document.querySelector('.bookmarks-section');
const contextPinItem = document.getElementById('context-pin');
const contextPinSeparator = document.getElementById('context-pin-separator');
const contextOpenAllItem = document.getElementById('context-open-all');
const contextOpenAllSeparator = document.getElementById('context-open-all-separator');
const contextOpenNewTabItem = document.getElementById('context-open-new-tab');
const contextOpenNewTabSeparator = document.getElementById('context-open-new-tab-separator');
const statsButton = document.getElementById('stats-button');
const statsModal = document.getElementById('stats-modal');
const helpButton = document.getElementById('help-button');
const helpModal = document.getElementById('help-modal');
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');

// Catppuccin theme palettes
const THEMES = {
  latte: {
    name: 'Latte', labelKey: 'theme.light',
    colors: {
      rosewater: '#dc8a78', flamingo: '#dd7878', pink: '#ea76cb', mauve: '#8839ef',
      red: '#d20f39', maroon: '#e64553', peach: '#fe640b', yellow: '#df8e1d',
      green: '#40a02b', teal: '#179299', sky: '#04a5e5', sapphire: '#209fb5',
      blue: '#1e66f5', lavender: '#7287fd',
      text: '#4c4f69', subtext1: '#5c5f77', subtext0: '#6c6f85',
      overlay2: '#7c7f93', overlay1: '#8c8fa1', overlay0: '#9ca0b0',
      surface2: '#acb0be', surface1: '#bcc0cc', surface0: '#ccd0da',
      base: '#eff1f5', mantle: '#e6e9ef', crust: '#dce0e8'
    }
  },
  frappe: {
    name: 'Frappé', labelKey: 'theme.medium',
    colors: {
      rosewater: '#f2d5cf', flamingo: '#eebebe', pink: '#f4b8e4', mauve: '#ca9ee6',
      red: '#e78284', maroon: '#ea999c', peach: '#ef9f76', yellow: '#e5c890',
      green: '#a6d189', teal: '#81c8be', sky: '#99d1db', sapphire: '#85c1dc',
      blue: '#8caaee', lavender: '#babbf1',
      text: '#c6d0f5', subtext1: '#b5bfe2', subtext0: '#a5adce',
      overlay2: '#949cbb', overlay1: '#838ba7', overlay0: '#737994',
      surface2: '#626880', surface1: '#51576d', surface0: '#414559',
      base: '#303446', mantle: '#292c3c', crust: '#232634'
    }
  },
  macchiato: {
    name: 'Macchiato', labelKey: 'theme.dark',
    colors: {
      rosewater: '#f4dbd6', flamingo: '#f0c6c6', pink: '#f5bde6', mauve: '#c6a0f6',
      red: '#ed8796', maroon: '#ee99a0', peach: '#f5a97f', yellow: '#eed49f',
      green: '#a6da95', teal: '#8bd5ca', sky: '#91d7e3', sapphire: '#7dc4e4',
      blue: '#8aadf4', lavender: '#b7bdf8',
      text: '#cad3f5', subtext1: '#b8c0e0', subtext0: '#a5adcb',
      overlay2: '#939ab7', overlay1: '#8087a2', overlay0: '#6e738d',
      surface2: '#5b6078', surface1: '#494d64', surface0: '#363a4f',
      base: '#24273a', mantle: '#1e2030', crust: '#181926'
    }
  },
  mocha: {
    name: 'Mocha', labelKey: 'theme.darkest',
    colors: {
      rosewater: '#f5e0dc', flamingo: '#f2cdcd', pink: '#f5c2e7', mauve: '#cba6f7',
      red: '#f38ba8', maroon: '#eba0ac', peach: '#fab387', yellow: '#f9e2af',
      green: '#a6e3a1', teal: '#94e2d5', sky: '#89dceb', sapphire: '#74c7ec',
      blue: '#89b4fa', lavender: '#b4befe',
      text: '#cdd6f4', subtext1: '#bac2de', subtext0: '#a6adc8',
      overlay2: '#9399b2', overlay1: '#7f849c', overlay0: '#6c7086',
      surface2: '#585b70', surface1: '#45475a', surface0: '#313244',
      base: '#1e1e2e', mantle: '#181825', crust: '#11111b'
    }
  }
};

// Accent color options
const ACCENT_COLORS = [
  'rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon',
  'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender'
];

// Color groups for custom color editor
const COLOR_GROUPS = [
  { labelKey: 'colors.background', keys: ['base', 'mantle', 'crust'] },
  { labelKey: 'colors.surfaces', keys: ['surface0', 'surface1', 'surface2'] },
  { labelKey: 'colors.overlays', keys: ['overlay0', 'overlay1', 'overlay2'] },
  { labelKey: 'colors.text', keys: ['text', 'subtext0', 'subtext1'] },
];

// Default settings
const DEFAULT_SETTINGS = {
  language: 'en',
  theme: 'macchiato',
  accentColor: 'mauve',
  customColors: {},
  colorPresets: [],
  savedPreset: null,
  bgOpacity: 0.3,
  density: 'normal',
  contentMaxWidth: 800,
  searchFontSize: 18,
  showVisitCount: true,
  doubleClickToOpen: false,
  middleClickNewTab: true,
  folderStartState: 'remembered',
  shortcuts: {},
  searchDebounce: 100,
  searchScope: 'both',
  searchPlaceholder: '',
  pinnedLimit: 10,
  pinnedShowEmpty: false,
  pinnedIconSize: 'normal',
  statsTopVisited: 10,
  statsTopFolders: 8,
  statsTopDomains: 8,
  showHelpButton: true,
  showStatsButton: true,
  showAddButton: true,
  showBgButton: true,
  buttonsPosition: 'bottom-right',
  buttonsOrder: ['help', 'stats', 'add', 'settings', 'bg'],
  warnDuplicateUrl: true,
  openAllThreshold: 5,
  defaultFolderStates: {}
};

// Default keyboard shortcuts
const DEFAULT_SHORTCUTS = {
  // Global
  'focus-search':       { key: 'f',          ctrl: true,  alt: true,  shift: false },
  'toggle-expand-all':  { key: 'e',          ctrl: true,  alt: false, shift: true  },
  'delete-selected':    { key: 'Delete',     ctrl: false, alt: false, shift: false },
  'edit-selected':      { key: 'e',          ctrl: true,  alt: true,  shift: false },
  'move-selected':      { key: 'r',          ctrl: true,  alt: true,  shift: false },
  'new-bookmark':       { key: 'n',          ctrl: true,  alt: true,  shift: false },
  'new-folder':         { key: 'm',          ctrl: true,  alt: true,  shift: false },
  'show-stats':         { key: 's',          ctrl: true,  alt: true,  shift: false },
  'show-help':          { key: '/',          ctrl: true,  alt: true,  shift: false },
  'show-settings':      { key: 's',          ctrl: false, alt: true,  shift: false },
  'open-all-in-folder': { key: 'o',          ctrl: true,  alt: true,  shift: false },
  'undo':               { key: 'z',          ctrl: true,  alt: false, shift: false },
  // Pinned
  'pin-bookmark':         { key: '.',          ctrl: false, alt: true,  shift: false },
  'unpin-bookmark':       { key: 'Delete',     ctrl: false, alt: true,  shift: false },
  'pinned-nav-left':      { key: 'ArrowLeft',  ctrl: false, alt: true,  shift: false },
  'pinned-nav-right':     { key: 'ArrowRight', ctrl: false, alt: true,  shift: false },
  'pinned-reorder-left':  { key: 'ArrowLeft',  ctrl: false, alt: true,  shift: true  },
  'pinned-reorder-right': { key: 'ArrowRight', ctrl: false, alt: true,  shift: true  },
  'pinned-open':          { key: 'Enter',      ctrl: false, alt: true,  shift: false },
  'pinned-open-new-tab':  { key: 'Enter',      ctrl: false, alt: true,  shift: true  },
  'exit-pinned-mode':     { key: 'Escape',     ctrl: false, alt: false, shift: false },
  // Navigation
  'nav-down':         { key: 'ArrowDown',  ctrl: false, alt: false, shift: false },
  'nav-up':           { key: 'ArrowUp',    ctrl: false, alt: false, shift: false },
  'jump-down-5':      { key: 'ArrowDown',  ctrl: true,  alt: false, shift: false },
  'jump-up-5':        { key: 'ArrowUp',    ctrl: true,  alt: false, shift: false },
  'move-down':        { key: 'ArrowDown',  ctrl: true,  alt: false, shift: true  },
  'move-up':          { key: 'ArrowUp',    ctrl: true,  alt: false, shift: true  },
  'go-to-start':      { key: 'Home',       ctrl: false, alt: false, shift: false },
  'go-to-end':        { key: 'End',        ctrl: false, alt: false, shift: false },
  'collapse-folder':  { key: 'ArrowLeft',  ctrl: false, alt: false, shift: false },
  'expand-folder':    { key: 'ArrowRight', ctrl: false, alt: false, shift: false },
  'open-or-toggle':   { key: 'Enter',      ctrl: false, alt: false, shift: false },
  'open-in-new-tab':  { key: 'Enter',      ctrl: false, alt: false, shift: true  },
  // Search
  'clear-search':     { key: 'Escape',     ctrl: false, alt: false, shift: false },
};

// Shortcut categories for UI and help modal
const SHORTCUT_CATEGORIES = [
  { id: 'navigation', titleKey: 'shortcuts.cat.navigation', shortcuts: [
    { id: 'nav-up',          labelKey: 'shortcut.navUp' },
    { id: 'nav-down',        labelKey: 'shortcut.navDown' },
    { id: 'collapse-folder', labelKey: 'shortcut.collapseFolder' },
    { id: 'expand-folder',   labelKey: 'shortcut.expandFolder' },
    { id: 'open-or-toggle',  labelKey: 'shortcut.openOrToggle' },
    { id: 'open-in-new-tab', labelKey: 'shortcut.openInNewTab' },
    { id: 'jump-up-5',       labelKey: 'shortcut.jumpUp5' },
    { id: 'jump-down-5',     labelKey: 'shortcut.jumpDown5' },
    { id: 'go-to-start',     labelKey: 'shortcut.goToStart' },
    { id: 'go-to-end',       labelKey: 'shortcut.goToEnd' },
  ]},
  { id: 'management', titleKey: 'shortcuts.cat.management', shortcuts: [
    { id: 'new-bookmark',    labelKey: 'shortcut.newBookmark' },
    { id: 'new-folder',      labelKey: 'shortcut.newFolder' },
    { id: 'edit-selected',   labelKey: 'shortcut.editSelected' },
    { id: 'move-selected',   labelKey: 'shortcut.moveSelected' },
    { id: 'move-up',         labelKey: 'shortcut.moveUp' },
    { id: 'move-down',       labelKey: 'shortcut.moveDown' },
    { id: 'delete-selected', labelKey: 'shortcut.deleteSelected' },
    { id: 'undo',            labelKey: 'shortcut.undo' },
    { id: 'pin-bookmark',    labelKey: 'shortcut.pinBookmark' },
  ]},
  { id: 'tools', titleKey: 'shortcuts.cat.tools', shortcuts: [
    { id: 'focus-search',       labelKey: 'shortcut.focusSearch' },
    { id: 'clear-search',       labelKey: 'shortcut.clearSearch' },
    { id: 'toggle-expand-all',  labelKey: 'shortcut.toggleExpandAll' },
    { id: 'open-all-in-folder', labelKey: 'shortcut.openAllInFolder' },
    { id: 'show-stats',         labelKey: 'shortcut.showStats' },
    { id: 'show-help',          labelKey: 'shortcut.showHelp' },
    { id: 'show-settings',      labelKey: 'shortcut.showSettings' },
  ]},
  { id: 'pinned', titleKey: 'shortcuts.cat.pinned', shortcuts: [
    { id: 'pinned-nav-left',      labelKey: 'shortcut.pinnedNavLeft' },
    { id: 'pinned-nav-right',     labelKey: 'shortcut.pinnedNavRight' },
    { id: 'pinned-open',          labelKey: 'shortcut.pinnedOpen' },
    { id: 'pinned-open-new-tab',  labelKey: 'shortcut.pinnedOpenNewTab' },
    { id: 'pinned-reorder-left',  labelKey: 'shortcut.pinnedReorderLeft' },
    { id: 'pinned-reorder-right', labelKey: 'shortcut.pinnedReorderRight' },
    { id: 'unpin-bookmark',       labelKey: 'shortcut.unpinBookmark' },
    { id: 'exit-pinned-mode',     labelKey: 'shortcut.exitPinnedMode' },
  ]},
];

// Shortcut helper functions
function getShortcuts() {
  return { ...DEFAULT_SHORTCUTS, ...(appSettings.shortcuts || {}) };
}

function matchesShortcut(e, def) {
  if (!def) return false;
  const eventKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const defKey = def.key.length === 1 ? def.key.toLowerCase() : def.key;
  return eventKey === defKey && e.ctrlKey === def.ctrl && e.altKey === def.alt && e.shiftKey === def.shift;
}

function formatShortcut(def) {
  if (!def) return '';
  const parts = [];
  if (def.ctrl)  parts.push('Ctrl');
  if (def.alt)   parts.push('Alt');
  if (def.shift) parts.push('Shift');
  const keyNames = {
    'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→',
    'Delete': 'Delete', 'Escape': 'Esc', 'Enter': 'Enter', 'Home': 'Home', 'End': 'End', ' ': 'Space'
  };
  parts.push(keyNames[def.key] || def.key.toUpperCase());
  return parts.join('+');
}

let appSettings = { ...DEFAULT_SETTINGS };

// Pending bookmark data (for adding after duplicate warning)
let pendingBookmark = null;

// Current bookmark/folder being edited/moved/deleted
let currentBookmarkElement = null;
let currentBookmarkId = null;
let currentItemIsFolder = false;
let selectedFolderIndex = 0;
let folderListItems = [];

// For creating new items
let preselectedFolderId = null;
let newItemFolderListItems = [];

// Undo stack
let undoStack = [];

// Get full folder structure recursively (for undo delete folder)
async function getFolderStructure(folderId) {
  const [folder] = await browser.bookmarks.get(folderId);
  const children = await browser.bookmarks.getChildren(folderId);

  const structure = {
    title: folder.title,
    parentId: folder.parentId,
    index: folder.index,
    children: []
  };

  for (const child of children) {
    if (child.url) {
      structure.children.push({
        type: 'bookmark',
        title: child.title,
        url: child.url,
        index: child.index
      });
    } else {
      structure.children.push({
        type: 'folder',
        data: await getFolderStructure(child.id)
      });
    }
  }

  return structure;
}

// Recreate folder structure recursively (for undo)
async function recreateFolderStructure(structure, parentId) {
  const folder = await browser.bookmarks.create({
    title: structure.title,
    parentId: parentId,
    index: structure.index
  });

  for (const child of structure.children) {
    if (child.type === 'bookmark') {
      await browser.bookmarks.create({
        title: child.title,
        url: child.url,
        parentId: folder.id,
        index: child.index
      });
    } else {
      await recreateFolderStructure(child.data, folder.id);
    }
  }

  return folder.id;
}

// Undo last action
async function undo() {
  if (undoStack.length === 0) return;

  const action = undoStack.pop();

  try {
    switch (action.type) {
      case 'delete-bookmark':
        await browser.bookmarks.create({
          title: action.data.title,
          url: action.data.url,
          parentId: action.data.parentId,
          index: action.data.index
        });
        break;

      case 'delete-folder':
        await recreateFolderStructure(action.data, action.data.parentId);
        break;

      case 'move':
        await browser.bookmarks.move(action.data.id, {
          parentId: action.data.oldParentId,
          index: action.data.oldIndex
        });
        break;

      case 'edit-bookmark':
        await browser.bookmarks.update(action.data.id, {
          title: action.data.oldTitle,
          url: action.data.oldUrl
        });
        break;

      case 'edit-folder':
        await browser.bookmarks.update(action.data.id, {
          title: action.data.oldTitle
        });
        break;

      case 'create-bookmark':
        await browser.bookmarks.remove(action.data.id);
        break;

      case 'create-folder':
        await browser.bookmarks.removeTree(action.data.id);
        break;

      case 'pin':
        // Undo pin = unpin
        const pinIndex = pinnedBookmarks.indexOf(action.data.bookmarkId);
        if (pinIndex > -1) {
          pinnedBookmarks.splice(pinIndex, 1);
          await savePinnedBookmarks();
          await renderPinnedBar();
        }
        break;

      case 'unpin':
        // Undo unpin = re-pin at original position
        pinnedBookmarks.splice(action.data.index, 0, action.data.bookmarkId);
        await savePinnedBookmarks();
        await renderPinnedBar();
        break;
    }

    await renderBookmarksTree();
    updateVisibleItems();
  } catch (e) {
    console.error('Undo failed:', e);
  }
}

// Initialize
async function init() {
  await loadSettings();
  currentLang = appSettings.language || 'en';
  document.documentElement.lang = currentLang;
  applyI18nToDom();
  applySettings();
  updateShortcutDisplays();
  await loadFolderStates();
  await loadClickCounts();
  await loadBackground();
  await loadPinnedBookmarks();
  await loadBookmarks();
  await renderBookmarksTree();
  await renderPinnedBar();
}

// Load click counts from storage
async function loadClickCounts() {
  try {
    const result = await browser.storage.local.get('clickCounts');
    clickCounts = result.clickCounts || {};
  } catch (e) {
    console.error('Failed to load click counts:', e);
    clickCounts = {};
  }
}

// Save click counts to storage
async function saveClickCounts() {
  try {
    await browser.storage.local.set({ clickCounts });
  } catch (e) {
    console.error('Failed to save click counts:', e);
  }
}

// Save folder states to storage
async function saveFolderStates() {
  try {
    await browser.storage.local.set({ folderStates });
  } catch (e) {
    console.error('Failed to save folder states:', e);
  }
}

// Load folder states from storage
async function loadFolderStates() {
  try {
    const result = await browser.storage.local.get('folderStates');
    folderStates = result.folderStates || {};
  } catch (e) {
    console.error('Failed to load folder states:', e);
  }
}

// Load pinned bookmarks from storage
async function loadPinnedBookmarks() {
  try {
    const result = await browser.storage.local.get('pinnedBookmarks');
    pinnedBookmarks = result.pinnedBookmarks || [];
    // Validate that pinned bookmarks still exist
    const validPinned = [];
    for (const id of pinnedBookmarks) {
      try {
        await browser.bookmarks.get(id);
        validPinned.push(id);
      } catch {
        // Bookmark no longer exists, skip it
      }
    }
    pinnedBookmarks = validPinned;
    await savePinnedBookmarks();
  } catch (e) {
    console.error('Failed to load pinned bookmarks:', e);
    pinnedBookmarks = [];
  }
}

// Save pinned bookmarks to storage
async function savePinnedBookmarks() {
  try {
    await browser.storage.local.set({ pinnedBookmarks });
  } catch (e) {
    console.error('Failed to save pinned bookmarks:', e);
  }
}

// Render pinned bookmarks bar
async function renderPinnedBar() {
  // Always show the bar (for symmetry with top)
  pinnedBar.classList.remove('hidden');

  // Toggle pinned mode class on body (hides main list selection)
  document.body.classList.toggle('pinned-mode', selectedPinnedIndex >= 0);

  if (pinnedBookmarks.length === 0) {
    pinnedBookmarksContainer.innerHTML = '';
    return;
  }

  let html = '';
  for (let i = 0; i < pinnedBookmarks.length; i++) {
    const id = pinnedBookmarks[i];
    try {
      const [bookmark] = await browser.bookmarks.get(id);
      const faviconUrl = getFaviconUrl(bookmark.url);
      const isSelected = i === selectedPinnedIndex;
      html += `
        <div class="pinned-item ${isSelected ? 'selected' : ''}"
             data-id="${id}"
             data-url="${escapeHtml(bookmark.url)}"
             data-index="${i}"
             draggable="true">
          <img class="pinned-favicon" src="${faviconUrl}" alt="">
          <span class="pinned-title">${escapeHtml(bookmark.title || bookmark.url)}</span>
        </div>
      `;
    } catch {
      // Bookmark no longer exists
    }
  }

  pinnedBookmarksContainer.innerHTML = html;

  // Add event handlers
  pinnedBookmarksContainer.querySelectorAll('.pinned-item').forEach(item => {
    const clickEvent = appSettings.doubleClickToOpen ? 'dblclick' : 'click';
    item.addEventListener(clickEvent, () => {
      openBookmark(item.dataset.url);
    });
    // Middle click - open in new tab
    item.addEventListener('auxclick', (e) => {
      if (e.button === 1 && appSettings.middleClickNewTab) {
        e.preventDefault();
        openBookmarkInNewTab(item.dataset.url);
      }
    });
    item.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showPinnedContextMenu(e, item);
    });

    // Drag and drop handlers
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.dataset.index);
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      pinnedBookmarksContainer.querySelectorAll('.pinned-item').forEach(el => {
        el.classList.remove('drag-over-left', 'drag-over-right');
      });
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      const draggingItem = pinnedBookmarksContainer.querySelector('.dragging');
      if (draggingItem === item) return;

      const rect = item.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;

      item.classList.remove('drag-over-left', 'drag-over-right');
      if (e.clientX < midX) {
        item.classList.add('drag-over-left');
      } else {
        item.classList.add('drag-over-right');
      }
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over-left', 'drag-over-right');
    });

    item.addEventListener('drop', async (e) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const toIndex = parseInt(item.dataset.index);

      if (fromIndex === toIndex) return;

      const rect = item.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      let targetIndex = e.clientX < midX ? toIndex : toIndex + 1;

      // Adjust if moving forward
      if (fromIndex < targetIndex) targetIndex--;

      if (fromIndex !== targetIndex) {
        // Move bookmark in array
        const [movedId] = pinnedBookmarks.splice(fromIndex, 1);
        pinnedBookmarks.splice(targetIndex, 0, movedId);

        await savePinnedBookmarks();
        await renderPinnedBar();
      }
    });
  });
}

// Show context menu for pinned item
function showPinnedContextMenu(e, item) {
  const id = item.dataset.id;
  currentBookmarkElement = item;
  currentBookmarkId = id;
  currentItemIsFolder = false;

  // Update pin text
  contextPinItem.querySelector('span').textContent = t('ctx.unpin');
  contextPinItem.style.display = '';
  contextPinSeparator.style.display = '';

  // Position the menu - show first to measure, then position
  contextMenu.style.left = '-9999px';
  contextMenu.style.top = '-9999px';
  contextMenu.classList.remove('hidden');

  const menuRect = contextMenu.getBoundingClientRect();
  const menuWidth = menuRect.width;
  const menuHeight = menuRect.height;

  let x = e.clientX;
  let y = e.clientY;

  // Adjust if menu would go off right edge
  if (x + menuWidth > window.innerWidth) {
    x = window.innerWidth - menuWidth - 10;
  }

  // Adjust if menu would go off bottom edge
  if (y + menuHeight > window.innerHeight) {
    y = window.innerHeight - menuHeight - 10;
  }

  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
}

// Toggle pin bookmark
async function togglePinBookmark(bookmarkId) {
  if (!bookmarkId) return;

  const index = pinnedBookmarks.indexOf(bookmarkId);
  if (index > -1) {
    // Unpin - save for undo
    undoStack.push({
      type: 'unpin',
      data: { bookmarkId, index }
    });
    pinnedBookmarks.splice(index, 1);
    if (selectedPinnedIndex >= pinnedBookmarks.length) {
      selectedPinnedIndex = pinnedBookmarks.length - 1;
    }
  } else {
    // Pin (max limit)
    const limit = appSettings.pinnedLimit ?? 10;
    if (pinnedBookmarks.length >= limit) {
      return; // Already at max
    }
    // Save for undo
    undoStack.push({
      type: 'pin',
      data: { bookmarkId }
    });
    pinnedBookmarks.push(bookmarkId);
  }

  await savePinnedBookmarks();
  await renderPinnedBar();
}

// Check if bookmark is pinned
function isPinned(bookmarkId) {
  return pinnedBookmarks.includes(bookmarkId);
}

// Move pinned bookmark left or right
async function movePinnedBookmark(direction) {
  if (selectedPinnedIndex < 0 || pinnedBookmarks.length < 2) return;

  const newIndex = selectedPinnedIndex + direction;
  if (newIndex < 0 || newIndex >= pinnedBookmarks.length) return;

  // Swap
  const temp = pinnedBookmarks[selectedPinnedIndex];
  pinnedBookmarks[selectedPinnedIndex] = pinnedBookmarks[newIndex];
  pinnedBookmarks[newIndex] = temp;
  selectedPinnedIndex = newIndex;

  await savePinnedBookmarks();
  await renderPinnedBar();
}

// Move bookmark or folder up/down within its parent
async function moveBookmarkInTree(direction) {
  const selected = visibleBookmarks[selectedIndex];
  if (!selected) return;

  // Get bookmark ID
  let bookmarkId;
  let isFolder = false;
  if (selected.classList.contains('folder-header')) {
    const folder = selected.closest('.folder');
    bookmarkId = folder?.dataset.folderId;
    isFolder = true;
  } else {
    bookmarkId = selected.dataset.id;
  }

  if (!bookmarkId) return;

  try {
    // Get bookmark info
    const [bookmark] = await browser.bookmarks.get(bookmarkId);
    const parentId = bookmark.parentId;
    const currentIndex = bookmark.index;

    // Get siblings
    const siblings = await browser.bookmarks.getChildren(parentId);
    const newIndex = currentIndex + direction;

    // Check bounds
    if (newIndex < 0 || newIndex >= siblings.length) return;

    // Save for undo
    undoStack.push({
      type: 'move',
      data: {
        id: bookmarkId,
        oldParentId: parentId,
        oldIndex: currentIndex
      }
    });

    // Move bookmark
    await browser.bookmarks.move(bookmarkId, { index: newIndex });

    // Re-render and keep selection on moved item
    await renderBookmarksTree();

    // Find the moved item in the new visible list
    const movedSelector = isFolder
      ? `.folder[data-folder-id="${bookmarkId}"] > .folder-header`
      : `.bookmark-item[data-id="${bookmarkId}"]`;
    const movedElement = bookmarksTree.querySelector(movedSelector);

    updateVisibleItems(movedElement);
  } catch (e) {
    console.error('Failed to move bookmark:', e);
  }
}

// Load background from storage
async function loadBackground() {
  try {
    const result = await browser.storage.local.get('backgroundImage');
    if (result.backgroundImage) {
      background.style.backgroundImage = `url(${result.backgroundImage})`;
    }
  } catch (e) {
    console.error('Failed to load background:', e);
  }
}

// Load all bookmarks
async function loadBookmarks() {
  try {
    const tree = await browser.bookmarks.getTree();
    allBookmarks = flattenBookmarks(tree[0]);
  } catch (e) {
    console.error('Failed to load bookmarks:', e);
    allBookmarks = [];
  }
}

// Flatten bookmark tree to array
function flattenBookmarks(node, folderId = null, folderPath = []) {
  let bookmarks = [];

  if (node.url) {
    bookmarks.push({
      id: node.id,
      title: node.title || node.url,
      url: node.url,
      folderId: folderId,
      folderPath: folderPath
    });
  }

  if (node.children) {
    const currentPath = node.title ? [...folderPath, node.title] : folderPath;
    for (const child of node.children) {
      bookmarks = bookmarks.concat(
        flattenBookmarks(child, node.id, currentPath)
      );
    }
  }

  return bookmarks;
}

// Get favicon URL for a bookmark
function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '';
  }
}

// Open bookmark and increment count
function openBookmark(url) {
  clickCounts[url] = (clickCounts[url] || 0) + 1;
  saveClickCounts();
  window.location.href = url;
}

// Open bookmark in new tab
function openBookmarkInNewTab(url) {
  clickCounts[url] = (clickCounts[url] || 0) + 1;
  saveClickCounts();
  browser.tabs.create({ url, active: false });
}

// Open all bookmarks in folder (in new tabs)
async function openAllInFolder(folderId) {
  try {
    const children = await browser.bookmarks.getChildren(folderId);
    const bookmarks = children.filter(c => c.url);

    if (bookmarks.length === 0) return;

    const threshold = appSettings.openAllThreshold ?? 5;
    if (threshold > 0 && bookmarks.length >= threshold) {
      if (!confirm(t('confirm.openAll', { count: bookmarks.length }))) return;
    }

    // Open all in new tabs
    for (const bookmark of bookmarks) {
      clickCounts[bookmark.url] = (clickCounts[bookmark.url] || 0) + 1;
      browser.tabs.create({ url: bookmark.url, active: false });
    }
    saveClickCounts();
  } catch (e) {
    console.error('Error opening all bookmarks:', e);
  }
}

// Render bookmarks tree (once, at startup)
async function renderBookmarksTree() {
  try {
    const tree = await browser.bookmarks.getTree();
    // Update allBookmarks for search and duplicate detection
    allBookmarks = flattenBookmarks(tree[0]);
    bookmarksTree.innerHTML = renderFolder(tree[0]);
    addFolderClickHandlers();
    addBookmarkClickHandlers();
    addContextMenuHandlers();
    restoreFolderStates();
    updateVisibleItems();
  } catch (e) {
    console.error('Failed to render bookmarks tree:', e);
    bookmarksTree.innerHTML = `<div class="empty-state">${t('error.loadBookmarks')}</div>`;
  }
}

// Restore folder open/close states from saved state
function restoreFolderStates() {
  const allFolders = bookmarksTree.querySelectorAll('.folder');
  const startState = appSettings.folderStartState;
  const defaults = appSettings.defaultFolderStates || {};
  allFolders.forEach(folder => {
    const folderId = folder.dataset.folderId;
    let isOpen;
    if (folderId in defaults) {
      // Per-folder override takes priority
      isOpen = defaults[folderId];
    } else if (startState === 'expanded') isOpen = true;
    else if (startState === 'collapsed') isOpen = false;
    else isOpen = folderStates[folderId] === true; // 'remembered'
    const header = folder.querySelector('.folder-header');
    const content = folder.querySelector('.folder-content');
    header.classList.toggle('open', isOpen);
    content.classList.toggle('open', isOpen);
  });
}

// Count bookmarks in a folder recursively
function countBookmarks(node) {
  let count = 0;
  if (node.url) count = 1;
  if (node.children) {
    for (const child of node.children) {
      count += countBookmarks(child);
    }
  }
  return count;
}

// Render a folder recursively (initial render, no filtering)
function renderFolder(node, depth = 0) {
  let html = '';

  if (node.children) {
    const showFolder = node.title && depth > 0;
    const bookmarkCount = countBookmarks(node);

    if (showFolder) {
      html += `
        <div class="folder" data-folder-id="${node.id}" data-search="${escapeHtml(node.title.toLowerCase())}" data-name="${escapeHtml(node.title)}">
          <div class="folder-header" draggable="true" data-id="${node.id}">
            <span class="arrow">▶</span>
            <span class="folder-name">${escapeHtml(node.title)}</span>
            <span class="count">${bookmarkCount}</span>
          </div>
          <div class="folder-content">
            <div class="folder-inner">
      `;
    }

    for (const child of node.children) {
      if (child.url) {
        const title = child.title || child.url;
        const faviconUrl = getFaviconUrl(child.url);
        const visitCount = clickCounts[child.url] || 0;
        const visitCountHtml = visitCount > 0
          ? `<span class="visit-count">${visitCount !== 1 ? t('tree.visitsPlural', { count: visitCount }) : t('tree.visits', { count: visitCount })}</span>`
          : '';
        html += `
          <div class="bookmark-item"
               data-id="${child.id}"
               data-url="${escapeHtml(child.url)}"
               data-title="${escapeHtml(title)}"
               data-search="${escapeHtml((child.title || '').toLowerCase() + ' ' + child.url.toLowerCase())}"
               draggable="true">
            <div class="bookmark-content">
              <img class="favicon" src="${faviconUrl}" alt="" loading="lazy">
              <span class="title">${escapeHtml(title)}</span>
            </div>
            <span class="url">${escapeHtml(child.url)}</span>
            ${visitCountHtml}
          </div>
        `;
      } else if (child.children) {
        html += renderFolder(child, depth + 1);
      }
    }

    if (showFolder) {
      html += `
            </div>
          </div>
        </div>
      `;
    }
  }

  return html;
}

// Add click handlers to folders
function addFolderClickHandlers() {
  const headers = bookmarksTree.querySelectorAll('.folder-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      // Don't allow manual toggle when searching
      if (currentQuery) return;

      const folder = header.parentElement;
      const folderId = folder.dataset.folderId;
      const content = folder.querySelector('.folder-content');
      const isOpen = header.classList.toggle('open');
      content.classList.toggle('open', isOpen);

      folderStates[folderId] = isOpen;
      saveFolderStates();

      // Update visible items for keyboard navigation
      setTimeout(() => updateVisibleItems(header), 50);
    });
  });
}

// Add click handlers to bookmarks in tree
function addBookmarkClickHandlers() {
  const items = bookmarksTree.querySelectorAll('.bookmark-item');
  items.forEach(item => {
    const clickEvent = appSettings.doubleClickToOpen ? 'dblclick' : 'click';
    item.addEventListener(clickEvent, () => {
      openBookmark(item.dataset.url);
    });
    // Middle click - open in new tab
    item.addEventListener('auxclick', (e) => {
      if (e.button === 1 && appSettings.middleClickNewTab) {
        e.preventDefault();
        openBookmarkInNewTab(item.dataset.url);
      }
    });
  });

  // Add drag and drop handlers for all draggable items
  addDragDropHandlers();
}

// Drag and drop state
let draggedElement = null;
let draggedId = null;
let draggedIsFolder = false;

// Add drag and drop handlers
function addDragDropHandlers() {
  const draggables = bookmarksTree.querySelectorAll('[draggable="true"]');

  draggables.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('drop', handleDrop);
  });
}

function handleDragStart(e) {
  draggedElement = e.target.closest('.bookmark-item, .folder-header');
  if (!draggedElement) return;

  draggedIsFolder = draggedElement.classList.contains('folder-header');
  draggedId = draggedElement.dataset.id;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedId);

  setTimeout(() => {
    draggedElement.classList.add('dragging');
  }, 0);
}

function handleDragEnd(e) {
  if (draggedElement) {
    draggedElement.classList.remove('dragging');
  }

  // Remove all drag-over classes
  bookmarksTree.querySelectorAll('.drag-over-top, .drag-over-bottom, .drag-over-into').forEach(el => {
    el.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-over-into');
  });

  draggedElement = null;
  draggedId = null;
  draggedIsFolder = false;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  const target = e.target.closest('.bookmark-item, .folder-header');
  if (!target || target === draggedElement) return;

  const rect = target.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  const isFolder = target.classList.contains('folder-header');

  // Remove previous drag-over classes from this target
  target.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-over-into');

  if (isFolder && !draggedIsFolder) {
    // For folders (when dragging bookmark), use thirds: top third = above, middle = into, bottom third = below
    const thirdHeight = rect.height / 3;
    if (e.clientY < rect.top + thirdHeight) {
      target.classList.add('drag-over-top');
    } else if (e.clientY > rect.bottom - thirdHeight) {
      target.classList.add('drag-over-bottom');
    } else {
      target.classList.add('drag-over-into');
    }
  } else {
    // For bookmarks or folder-to-folder, use halves: top = above, bottom = below
    if (e.clientY < midY) {
      target.classList.add('drag-over-top');
    } else {
      target.classList.add('drag-over-bottom');
    }
  }
}

function handleDragLeave(e) {
  const target = e.target.closest('.bookmark-item, .folder-header');
  if (target) {
    target.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-over-into');
  }
}

async function handleDrop(e) {
  e.preventDefault();

  const target = e.target.closest('.bookmark-item, .folder-header');
  if (!target || !draggedId) return;

  const targetIsFolder = target.classList.contains('folder-header');
  let targetId;

  if (targetIsFolder) {
    const folder = target.closest('.folder');
    targetId = folder?.dataset.folderId;
  } else {
    targetId = target.dataset.id;
  }

  if (!targetId || targetId === draggedId) return;

  try {
    const [draggedBookmark] = await browser.bookmarks.get(draggedId);
    const [targetBookmark] = await browser.bookmarks.get(targetId);

    // Save for undo
    undoStack.push({
      type: 'move',
      data: {
        id: draggedId,
        oldParentId: draggedBookmark.parentId,
        oldIndex: draggedBookmark.index
      }
    });

    if (target.classList.contains('drag-over-into') && targetIsFolder) {
      // Move into folder (at the end)
      await browser.bookmarks.move(draggedId, {
        parentId: targetId
      });
    } else {
      // Move before or after target
      const rect = target.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const insertBefore = e.clientY < midY || target.classList.contains('drag-over-top');

      let newIndex = targetBookmark.index;
      if (!insertBefore) newIndex++;

      // If moving within same parent and from higher index, adjust
      if (draggedBookmark.parentId === targetBookmark.parentId && draggedBookmark.index < targetBookmark.index) {
        newIndex--;
      }

      await browser.bookmarks.move(draggedId, {
        parentId: targetBookmark.parentId,
        index: newIndex
      });
    }

    // Re-render
    await renderBookmarksTree();

    // Find and select the moved item
    const movedSelector = draggedIsFolder
      ? `.folder[data-folder-id="${draggedId}"] > .folder-header`
      : `.bookmark-item[data-id="${draggedId}"]`;
    const movedElement = bookmarksTree.querySelector(movedSelector);
    updateVisibleItems(movedElement);

  } catch (err) {
    console.error('Failed to move bookmark:', err);
  }
}

// Check if an element is actually visible (all parent folders are open)
function isElementVisible(el) {
  // Check if element itself is hidden
  if (el.classList.contains('hidden')) return false;

  // Check all parent folder-content elements - they must be open
  let parent = el.parentElement;
  while (parent && parent !== bookmarksTree) {
    if (parent.classList.contains('folder-content') && !parent.classList.contains('open')) {
      return false;
    }
    if (parent.classList.contains('folder') && parent.classList.contains('hidden')) {
      return false;
    }
    parent = parent.parentElement;
  }
  return true;
}

// Update visible items list for keyboard navigation (folders + bookmarks)
function updateVisibleItems(keepSelected = null) {
  // Get all folder headers and bookmark items, then filter to only visible ones
  const allItems = Array.from(
    bookmarksTree.querySelectorAll('.folder > .folder-header, .bookmark-item')
  );

  visibleBookmarks = allItems.filter(isElementVisible);

  // Try to keep the same element selected
  if (keepSelected) {
    const newIndex = visibleBookmarks.indexOf(keepSelected);
    selectedIndex = newIndex >= 0 ? newIndex : 0;
  } else {
    selectedIndex = visibleBookmarks.length > 0 ? 0 : -1;
  }

  updateSelection();
}

// Update selected item highlight
function updateSelection() {
  // Remove selection from all
  bookmarksTree.querySelectorAll('.selected').forEach(item => {
    item.classList.remove('selected');
  });

  if (visibleBookmarks[selectedIndex]) {
    const selected = visibleBookmarks[selectedIndex];
    selected.classList.add('selected');

    // Scroll within bookmarks section container
    const container = bookmarksSection;
    const containerRect = container.getBoundingClientRect();
    const selectedRect = selected.getBoundingClientRect();

    if (selectedRect.top < containerRect.top) {
      // Element is above visible area
      container.scrollTop -= (containerRect.top - selectedRect.top + 10);
    } else if (selectedRect.bottom > containerRect.bottom) {
      // Element is below visible area
      container.scrollTop += (selectedRect.bottom - containerRect.bottom + 10);
    }
  }
}

// Highlight matching text in a string
function highlightMatch(text, query) {
  if (!query || !text) return escapeHtml(text);

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return escapeHtml(text);

  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);

  return escapeHtml(before) + '<mark>' + escapeHtml(match) + '</mark>' + escapeHtml(after);
}

// Filter tree by toggling classes (no DOM re-rendering)
function filterTree(query) {
  currentQuery = query;
  const lowerQuery = query.toLowerCase().trim();
  const isSearching = lowerQuery.length > 0;

  bookmarksTree.classList.toggle('searching', isSearching);

  const allItems = bookmarksTree.querySelectorAll('.bookmark-item');
  const allFolders = bookmarksTree.querySelectorAll('.folder');

  if (!isSearching) {
    // Reset: show all items, restore folder states and original text
    allItems.forEach(item => {
      item.classList.remove('hidden', 'match');
      // Restore original text
      const titleEl = item.querySelector('.title');
      const urlEl = item.querySelector('.url');
      titleEl.innerHTML = escapeHtml(item.dataset.title);
      urlEl.innerHTML = escapeHtml(item.dataset.url);
    });
    allFolders.forEach(folder => {
      folder.classList.remove('hidden', 'has-match', 'folder-match');
      // Restore original folder name
      const nameEl = folder.querySelector('.folder-name');
      nameEl.innerHTML = escapeHtml(folder.dataset.name);

      const header = folder.querySelector('.folder-header');
      const content = folder.querySelector('.folder-content');
      const folderId = folder.dataset.folderId;
      const isOpen = folderStates[folderId] === true;
      header.classList.toggle('open', isOpen);
      content.classList.toggle('open', isOpen);
    });
  } else {
    // First pass: check which folders match by name
    const matchingFolderIds = new Set();
    allFolders.forEach(folder => {
      const folderSearch = folder.dataset.search || '';
      if (folderSearch.includes(lowerQuery)) {
        matchingFolderIds.add(folder.dataset.folderId);
      }
    });

    // Second pass: filter bookmarks and highlight matches
    const scope = appSettings.searchScope || 'both';
    allItems.forEach((item, index) => {
      let searchText;
      if (scope === 'title') searchText = (item.dataset.title || '').toLowerCase();
      else if (scope === 'url') searchText = (item.dataset.url || '').toLowerCase();
      else searchText = item.dataset.search || '';
      const bookmarkMatches = searchText.includes(lowerQuery);

      // Check if this item is inside a matching folder
      const parentFolder = item.closest('.folder');
      const inMatchingFolder = parentFolder && matchingFolderIds.has(parentFolder.dataset.folderId);

      const shouldShow = bookmarkMatches || inMatchingFolder;

      item.classList.toggle('hidden', !shouldShow);
      item.classList.toggle('match', shouldShow);

      if (shouldShow) {
        item.style.setProperty('--match-index', index);
        // Highlight matching text
        const titleEl = item.querySelector('.title');
        const urlEl = item.querySelector('.url');
        titleEl.innerHTML = highlightMatch(item.dataset.title, query);
        urlEl.innerHTML = highlightMatch(item.dataset.url, query);
      }
    });

    // Third pass: update folder visibility and highlight folder names
    allFolders.forEach(folder => {
      const folderMatches = matchingFolderIds.has(folder.dataset.folderId);
      const hasMatchingChildren = folder.querySelector('.bookmark-item.match') !== null;
      const shouldShow = folderMatches || hasMatchingChildren;

      folder.classList.toggle('hidden', !shouldShow);
      folder.classList.toggle('has-match', shouldShow);
      folder.classList.toggle('folder-match', folderMatches);

      // Highlight folder name if it matches
      const nameEl = folder.querySelector('.folder-name');
      if (folderMatches) {
        nameEl.innerHTML = highlightMatch(folder.dataset.name, query);
      } else {
        nameEl.innerHTML = escapeHtml(folder.dataset.name);
      }

      // Auto-expand folders with matches
      if (shouldShow) {
        const header = folder.querySelector('.folder-header');
        const content = folder.querySelector('.folder-content');
        header.classList.add('open');
        content.classList.add('open');
      }
    });
  }

  updateVisibleItems();
}

// Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Normalize URL for duplicate detection
function normalizeUrl(url) {
  if (!url) return '';
  try {
    let normalized = url.toLowerCase().trim();
    // Remove protocol
    normalized = normalized.replace(/^https?:\/\//, '');
    // Remove www.
    normalized = normalized.replace(/^www\./, '');
    // Remove trailing slash
    normalized = normalized.replace(/\/$/, '');
    return normalized;
  } catch {
    return url.toLowerCase().trim();
  }
}

// Find duplicate bookmarks by URL
function findDuplicates(url) {
  const normalizedUrl = normalizeUrl(url);
  return allBookmarks.filter(b => normalizeUrl(b.url) === normalizedUrl);
}

// Debounce helper
let debounceTimer;
function debounce(fn, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fn, delay);
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  const delay = appSettings.searchDebounce ?? 100;
  if (delay === 0) {
    filterTree(query);
  } else {
    debounce(() => filterTree(query), delay);
  }
});

// Check if all folders are expanded
function areAllFoldersExpanded() {
  const allFolders = bookmarksTree.querySelectorAll('.folder');
  for (const folder of allFolders) {
    const header = folder.querySelector('.folder-header');
    if (!header.classList.contains('open')) {
      return false;
    }
  }
  return true;
}

// Toggle all folders expand/collapse
function toggleAllFolders() {
  if (currentQuery) return; // Don't allow when searching

  const shouldExpand = !areAllFoldersExpanded();
  const allFolders = bookmarksTree.querySelectorAll('.folder');

  allFolders.forEach(folder => {
    const header = folder.querySelector('.folder-header');
    const content = folder.querySelector('.folder-content');
    header.classList.toggle('open', shouldExpand);
    content.classList.toggle('open', shouldExpand);
    folderStates[folder.dataset.folderId] = shouldExpand;
  });
  saveFolderStates();
  updateVisibleItems();
}

// Global shortcuts
document.addEventListener('keydown', (e) => {
  const sc = getShortcuts();

  // === Global shortcuts ===
  if (matchesShortcut(e, sc['focus-search'])) { e.preventDefault(); searchInput.focus(); return; }
  if (matchesShortcut(e, sc['toggle-expand-all'])) { e.preventDefault(); toggleAllFolders(); return; }
  if (matchesShortcut(e, sc['new-bookmark'])) { e.preventDefault(); showNewBookmarkModal(); return; }
  if (matchesShortcut(e, sc['new-folder'])) { e.preventDefault(); showNewFolderModal(); return; }
  if (matchesShortcut(e, sc['show-stats'])) { e.preventDefault(); showStats(); return; }
  if (matchesShortcut(e, sc['show-help'])) { e.preventDefault(); showHelp(); return; }
  if (matchesShortcut(e, sc['show-settings'])) { e.preventDefault(); showSettings(); return; }
  if (matchesShortcut(e, sc['undo'])) { e.preventDefault(); undo(); return; }

  // === Global, disabled in pinned mode ===
  if (matchesShortcut(e, sc['delete-selected'])) {
    if (selectedPinnedIndex >= 0) return;
    const selected = visibleBookmarks[selectedIndex];
    if (selected) {
      if (selected.classList.contains('bookmark-item')) { e.preventDefault(); showDeleteConfirm(selected, false); return; }
      else if (selected.classList.contains('folder-header')) { e.preventDefault(); showDeleteConfirm(selected, true); return; }
    }
  }
  if (matchesShortcut(e, sc['edit-selected'])) {
    if (selectedPinnedIndex >= 0) return;
    const selected = visibleBookmarks[selectedIndex];
    if (selected) {
      if (selected.classList.contains('bookmark-item')) { e.preventDefault(); showEditModal(selected, false); return; }
      else if (selected.classList.contains('folder-header')) { e.preventDefault(); showEditModal(selected, true); return; }
    }
  }
  if (matchesShortcut(e, sc['move-selected'])) {
    if (selectedPinnedIndex >= 0) return;
    const selected = visibleBookmarks[selectedIndex];
    if (selected) {
      if (selected.classList.contains('bookmark-item')) { e.preventDefault(); showMoveModal(selected, false); return; }
      else if (selected.classList.contains('folder-header')) { e.preventDefault(); showMoveModal(selected, true); return; }
    }
  }
  if (matchesShortcut(e, sc['open-all-in-folder'])) {
    if (selectedPinnedIndex >= 0) return;
    const selected = visibleBookmarks[selectedIndex];
    if (selected && selected.classList.contains('folder-header')) {
      e.preventDefault();
      const folder = selected.closest('.folder');
      if (folder) openAllInFolder(folder.dataset.folderId);
    }
    return;
  }
  if (matchesShortcut(e, sc['pin-bookmark'])) {
    if (selectedPinnedIndex >= 0) return;
    const selected = visibleBookmarks[selectedIndex];
    if (selected && selected.classList.contains('bookmark-item')) {
      e.preventDefault();
      togglePinBookmark(selected.dataset.id);
      return;
    }
  }

  // === Pinned bookmarks shortcuts ===
  if (matchesShortcut(e, sc['unpin-bookmark'])) {
    if (selectedPinnedIndex >= 0 && pinnedBookmarks[selectedPinnedIndex]) {
      e.preventDefault();
      togglePinBookmark(pinnedBookmarks[selectedPinnedIndex]);
      if (pinnedBookmarks.length === 0) selectedPinnedIndex = -1;
      else if (selectedPinnedIndex >= pinnedBookmarks.length) selectedPinnedIndex = pinnedBookmarks.length - 1;
      return;
    }
  }
  if (matchesShortcut(e, sc['pinned-nav-left']) || matchesShortcut(e, sc['pinned-nav-right'])) {
    if (pinnedBookmarks.length > 0) {
      e.preventDefault();
      const isLeft = matchesShortcut(e, sc['pinned-nav-left']);
      if (selectedPinnedIndex === -1) {
        savedSelectedIndex = selectedIndex;
        selectedPinnedIndex = isLeft ? pinnedBookmarks.length - 1 : 0;
      } else {
        selectedPinnedIndex = isLeft ? Math.max(0, selectedPinnedIndex - 1) : Math.min(pinnedBookmarks.length - 1, selectedPinnedIndex + 1);
      }
      renderPinnedBar();
      return;
    }
  }
  if (matchesShortcut(e, sc['pinned-reorder-left']) || matchesShortcut(e, sc['pinned-reorder-right'])) {
    if (pinnedBookmarks.length > 0) {
      e.preventDefault();
      if (selectedPinnedIndex >= 0) {
        movePinnedBookmark(matchesShortcut(e, sc['pinned-reorder-left']) ? -1 : 1);
      } else {
        savedSelectedIndex = selectedIndex;
        selectedPinnedIndex = 0;
        renderPinnedBar();
      }
      return;
    }
  }
  if (matchesShortcut(e, sc['pinned-open'])) {
    if (selectedPinnedIndex >= 0 && pinnedBookmarks[selectedPinnedIndex]) {
      e.preventDefault();
      browser.bookmarks.get(pinnedBookmarks[selectedPinnedIndex]).then(([b]) => openBookmark(b.url));
      return;
    }
  }
  if (matchesShortcut(e, sc['pinned-open-new-tab'])) {
    if (selectedPinnedIndex >= 0 && pinnedBookmarks[selectedPinnedIndex]) {
      e.preventDefault();
      browser.bookmarks.get(pinnedBookmarks[selectedPinnedIndex]).then(([b]) => openBookmarkInNewTab(b.url));
      return;
    }
  }
  if (matchesShortcut(e, sc['exit-pinned-mode']) && selectedPinnedIndex >= 0) {
    e.preventDefault();
    selectedPinnedIndex = -1;
    if (savedSelectedIndex >= 0 && savedSelectedIndex < visibleBookmarks.length) selectedIndex = savedSelectedIndex;
    savedSelectedIndex = -1;
    renderPinnedBar();
    updateSelection();
    searchInput.focus();
    return;
  }

  // === Navigation (blocked when modal open or in pinned mode) ===
  if (!modalOverlay.classList.contains('hidden')) return;
  if (selectedPinnedIndex >= 0) return;

  if (matchesShortcut(e, sc['nav-down'])) {
    if (visibleBookmarks.length > 0) { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, visibleBookmarks.length - 1); updateSelection(); }
    return;
  }
  if (matchesShortcut(e, sc['nav-up'])) {
    if (visibleBookmarks.length > 0) { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); updateSelection(); }
    return;
  }
  if (matchesShortcut(e, sc['jump-down-5'])) {
    if (visibleBookmarks.length > 0) { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 5, visibleBookmarks.length - 1); updateSelection(); }
    return;
  }
  if (matchesShortcut(e, sc['jump-up-5'])) {
    if (visibleBookmarks.length > 0) { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 5, 0); updateSelection(); }
    return;
  }
  if (matchesShortcut(e, sc['move-down'])) { e.preventDefault(); moveBookmarkInTree(1); return; }
  if (matchesShortcut(e, sc['move-up'])) { e.preventDefault(); moveBookmarkInTree(-1); return; }
  if (matchesShortcut(e, sc['go-to-start'])) {
    if (visibleBookmarks.length > 0) { e.preventDefault(); selectedIndex = 0; updateSelection(); }
    return;
  }
  if (matchesShortcut(e, sc['go-to-end'])) {
    if (visibleBookmarks.length > 0) { e.preventDefault(); selectedIndex = visibleBookmarks.length - 1; updateSelection(); }
    return;
  }
  if (matchesShortcut(e, sc['collapse-folder']) && !currentQuery) {
    const selected = visibleBookmarks[selectedIndex];
    if (selected && selected.classList.contains('folder-header')) {
      const folder = selected.closest('.folder');
      if (folder && folder.classList.contains('open')) { e.preventDefault(); selected.click(); setTimeout(() => updateVisibleItems(selected), 50); }
    }
    return;
  }
  if (matchesShortcut(e, sc['expand-folder']) && !currentQuery) {
    const selected = visibleBookmarks[selectedIndex];
    if (selected && selected.classList.contains('folder-header')) {
      const folder = selected.closest('.folder');
      if (folder && !folder.classList.contains('open')) { e.preventDefault(); selected.click(); setTimeout(() => updateVisibleItems(selected), 50); }
    }
    return;
  }
  if (matchesShortcut(e, sc['open-or-toggle'])) {
    if (selectedIndex >= 0 && visibleBookmarks[selectedIndex]) {
      const selected = visibleBookmarks[selectedIndex];
      if (selected.classList.contains('folder-header')) {
        if (!currentQuery) { e.preventDefault(); selected.click(); setTimeout(() => updateVisibleItems(selected), 50); }
      } else if (selected.dataset.url) { e.preventDefault(); openBookmark(selected.dataset.url); }
    }
    return;
  }
  if (matchesShortcut(e, sc['open-in-new-tab'])) {
    if (selectedIndex >= 0 && visibleBookmarks[selectedIndex]) {
      const selected = visibleBookmarks[selectedIndex];
      if (selected.dataset.url) { e.preventDefault(); openBookmarkInNewTab(selected.dataset.url); }
    }
    return;
  }
});

searchInput.addEventListener('keydown', (e) => {
  if (matchesShortcut(e, getShortcuts()['clear-search'])) {
    e.preventDefault();
    searchInput.value = '';
    filterTree('');
    return;
  }
});

// Background image handling
bgButton.addEventListener('click', () => {
  bgInput.click();
});

bgInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const base64 = event.target.result;
    background.style.backgroundImage = `url(${base64})`;

    try {
      await browser.storage.local.set({ backgroundImage: base64 });
    } catch (err) {
      console.error('Failed to save background:', err);
    }
  };
  reader.readAsDataURL(file);
});

// Context Menu
function showContextMenu(e, element, isFolder = false) {
  e.preventDefault();
  currentBookmarkElement = element;
  currentItemIsFolder = isFolder;

  // Show/hide folder-only options (no longer needed, always show)
  contextMenu.classList.toggle('show-folder-options', isFolder);

  // Store folder ID for "new bookmark/folder here"
  if (isFolder) {
    const folder = element.closest('.folder');
    preselectedFolderId = folder ? folder.dataset.folderId : null;
    // Hide pin option for folders
    contextPinItem.style.display = 'none';
    contextPinSeparator.style.display = 'none';
    // Show open-all option for folders
    contextOpenAllItem.style.display = '';
    contextOpenAllSeparator.style.display = '';
    // Hide open in new tab for folders
    contextOpenNewTabItem.style.display = 'none';
    contextOpenNewTabSeparator.style.display = 'none';
  } else {
    // For bookmarks, get the parent folder
    const parentFolder = element.closest('.folder');
    preselectedFolderId = parentFolder ? parentFolder.dataset.folderId : null;
    // Show pin option and update text
    contextPinItem.style.display = '';
    contextPinSeparator.style.display = '';
    const bookmarkId = element.dataset.id;
    contextPinItem.querySelector('span').textContent = isPinned(bookmarkId) ? t('ctx.unpin') : t('ctx.pin');
    // Hide open-all option for bookmarks
    contextOpenAllItem.style.display = 'none';
    contextOpenAllSeparator.style.display = 'none';
    // Show open in new tab for bookmarks
    contextOpenNewTabItem.style.display = '';
    contextOpenNewTabSeparator.style.display = '';
  }

  // Position the menu - show first to measure, then position
  contextMenu.style.left = '-9999px';
  contextMenu.style.top = '-9999px';
  contextMenu.classList.remove('hidden');

  const menuRect = contextMenu.getBoundingClientRect();
  const menuWidth = menuRect.width;
  const menuHeight = menuRect.height;

  let x = e.clientX;
  let y = e.clientY;

  // Adjust if menu would go off right edge
  if (x + menuWidth > window.innerWidth) {
    x = window.innerWidth - menuWidth - 10;
  }

  // Adjust if menu would go off bottom edge
  if (y + menuHeight > window.innerHeight) {
    y = window.innerHeight - menuHeight - 10;
  }

  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
}

function hideContextMenu() {
  contextMenu.classList.add('hidden');
  currentItemIsFolder = false;
}

// Context menu click handlers
contextMenu.addEventListener('click', (e) => {
  const item = e.target.closest('.context-menu-item');
  if (!item) return;

  const action = item.dataset.action;
  const isFolder = currentItemIsFolder;
  const folderId = preselectedFolderId;
  hideContextMenu();

  switch (action) {
    case 'new-bookmark':
      showNewBookmarkModal(folderId);
      break;
    case 'new-folder':
      showNewFolderModal(folderId);
      break;
    case 'pin':
      if (currentBookmarkElement && !isFolder) {
        const bookmarkId = currentBookmarkElement.dataset.id;
        togglePinBookmark(bookmarkId);
      }
      break;
    case 'open-new-tab':
      if (currentBookmarkElement && !isFolder) {
        openBookmarkInNewTab(currentBookmarkElement.dataset.url);
      }
      break;
    case 'open-all':
      if (folderId) {
        openAllInFolder(folderId);
      }
      break;
    case 'edit':
      if (currentBookmarkElement) showEditModal(currentBookmarkElement, isFolder);
      break;
    case 'move':
      if (currentBookmarkElement) showMoveModal(currentBookmarkElement, isFolder);
      break;
    case 'delete':
      if (currentBookmarkElement) showDeleteConfirm(currentBookmarkElement, isFolder);
      break;
  }
});

// Hide context menu on click outside
document.addEventListener('click', (e) => {
  if (!contextMenu.contains(e.target)) {
    hideContextMenu();
  }
});

// Add right-click handler to bookmarks and folders
function addContextMenuHandlers() {
  // Bookmarks
  const items = bookmarksTree.querySelectorAll('.bookmark-item');
  items.forEach(item => {
    item.addEventListener('contextmenu', (e) => {
      showContextMenu(e, item, false);
    });
  });

  // Folders
  const folders = bookmarksTree.querySelectorAll('.folder-header');
  folders.forEach(folder => {
    folder.addEventListener('contextmenu', (e) => {
      e.stopPropagation(); // Prevent folder toggle
      showContextMenu(e, folder, true);
    });
  });
}

// Modal helpers
function showModal(modal) {
  modalOverlay.classList.remove('hidden');
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  modal.classList.remove('hidden');
  modalOverlay.focus();
}

function hideModal() {
  modalOverlay.classList.add('hidden');
  currentBookmarkElement = null;
  currentBookmarkId = null;
  currentItemIsFolder = false;
  // Restore focus to search input
  searchInput.focus();
}

// Get bookmark ID from element (bookmark or folder)
function getBookmarkIdFromElement(element, isFolder = false) {
  if (isFolder) {
    // For folder headers, get the parent folder's data-folder-id
    const folder = element.closest('.folder');
    return folder ? folder.dataset.folderId : null;
  }
  return element.dataset.id;
}

// Delete Confirmation
async function showDeleteConfirm(element, isFolder = false) {
  currentBookmarkElement = element;
  currentItemIsFolder = isFolder;
  currentBookmarkId = getBookmarkIdFromElement(element, isFolder);

  let title;
  let hasChildren = false;

  if (isFolder) {
    const folder = element.closest('.folder');
    title = folder.dataset.name;

    // Check if folder has any bookmarks
    try {
      const children = await browser.bookmarks.getChildren(currentBookmarkId);
      hasChildren = children.length > 0;
    } catch (e) {
      hasChildren = false;
    }
  } else {
    title = element.dataset.title;
  }

  // Update modal text for folder/bookmark
  deleteModal.querySelector('.modal-header').textContent = t(isFolder ? 'modal.delete.headerFolder' : 'modal.delete.headerBookmark');
  deleteModal.querySelector('.modal-delete-body-text').textContent = t(isFolder ? 'modal.delete.bodyFolder' : 'modal.delete.bodyBookmark');
  deleteModal.querySelector('.modal-bookmark-title').textContent = title;

  // Show warning only for folders with content
  const warning = deleteModal.querySelector('.modal-warning');
  warning.classList.toggle('hidden', !isFolder || !hasChildren);

  showModal(deleteModal);
}

async function confirmDelete() {
  if (!currentBookmarkId) return;

  try {
    if (currentItemIsFolder) {
      // Save folder structure for undo
      const structure = await getFolderStructure(currentBookmarkId);
      undoStack.push({
        type: 'delete-folder',
        data: structure
      });
      await browser.bookmarks.removeTree(currentBookmarkId);
    } else {
      // Save bookmark data for undo
      const [bookmark] = await browser.bookmarks.get(currentBookmarkId);
      undoStack.push({
        type: 'delete-bookmark',
        data: {
          title: bookmark.title,
          url: bookmark.url,
          parentId: bookmark.parentId,
          index: bookmark.index
        }
      });
      await browser.bookmarks.remove(currentBookmarkId);
    }

    hideModal();

    // Re-render the bookmarks tree
    await renderBookmarksTree();
    updateVisibleItems();
  } catch (e) {
    console.error('Failed to delete:', e);
  }
}

// Edit Modal
function showEditModal(element, isFolder = false) {
  currentBookmarkElement = element;
  currentItemIsFolder = isFolder;
  currentBookmarkId = getBookmarkIdFromElement(element, isFolder);

  let title, url;
  if (isFolder) {
    const folder = element.closest('.folder');
    title = folder.dataset.name;
    url = '';
  } else {
    title = element.dataset.title;
    url = element.dataset.url;
  }

  // Update modal text for folder/bookmark
  editModal.querySelector('.modal-header').textContent = t(isFolder ? 'modal.edit.headerFolder' : 'modal.edit.headerBookmark');

  // Hide URL field for folders
  document.getElementById('edit-url-label').classList.toggle('hidden', isFolder);

  document.getElementById('edit-title').value = title;
  document.getElementById('edit-url').value = url;

  showModal(editModal);
  document.getElementById('edit-title').focus();
  document.getElementById('edit-title').select();
}

async function confirmEdit() {
  if (!currentBookmarkId) return;

  const newTitle = document.getElementById('edit-title').value.trim();
  const newUrl = document.getElementById('edit-url').value.trim();

  if (!newTitle) return;
  if (!currentItemIsFolder && !newUrl) return;

  try {
    // Get old values for undo
    const [bookmarkInfo] = await browser.bookmarks.get(currentBookmarkId);

    if (currentItemIsFolder) {
      // Save for undo
      undoStack.push({
        type: 'edit-folder',
        data: {
          id: currentBookmarkId,
          oldTitle: bookmarkInfo.title
        }
      });

      await browser.bookmarks.update(currentBookmarkId, { title: newTitle });

      // Update folder DOM
      const folder = currentBookmarkElement.closest('.folder');
      folder.dataset.name = newTitle;
      folder.dataset.search = newTitle.toLowerCase();
      folder.querySelector('.folder-name').textContent = newTitle;
    } else {
      // Save for undo
      undoStack.push({
        type: 'edit-bookmark',
        data: {
          id: currentBookmarkId,
          oldTitle: bookmarkInfo.title,
          oldUrl: bookmarkInfo.url
        }
      });

      await browser.bookmarks.update(currentBookmarkId, {
        title: newTitle,
        url: newUrl
      });

      // Update bookmark DOM
      currentBookmarkElement.dataset.title = newTitle;
      currentBookmarkElement.dataset.url = newUrl;
      currentBookmarkElement.dataset.search = (newTitle.toLowerCase() + ' ' + newUrl.toLowerCase());
      currentBookmarkElement.querySelector('.title').textContent = newTitle;
      currentBookmarkElement.querySelector('.url').textContent = newUrl;

      // Update favicon
      const favicon = currentBookmarkElement.querySelector('.favicon');
      favicon.src = getFaviconUrl(newUrl);
    }

    hideModal();
  } catch (e) {
    console.error('Failed to update:', e);
  }
}

// Move Modal
async function showMoveModal(element, isFolder = false) {
  currentBookmarkElement = element;
  currentItemIsFolder = isFolder;
  currentBookmarkId = getBookmarkIdFromElement(element, isFolder);

  let title;
  if (isFolder) {
    const folder = element.closest('.folder');
    title = folder.dataset.name;
  } else {
    title = element.dataset.title;
  }

  moveModal.querySelector('.modal-bookmark-title').textContent = title;

  // Build folder tree
  const folderList = document.getElementById('folder-list');
  const tree = await browser.bookmarks.getTree();

  // Get IDs to exclude (when moving a folder, exclude itself and children)
  const excludeIds = isFolder ? getDescendantFolderIds(tree[0], currentBookmarkId) : [];
  if (isFolder) excludeIds.push(currentBookmarkId);

  folderList.innerHTML = renderFolderTree(tree[0], excludeIds, 0, currentBookmarkId);

  // Add expand/collapse handlers
  folderList.querySelectorAll('.folder-tree-arrow:not(.hidden)').forEach(arrow => {
    arrow.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = arrow.closest('.folder-tree-item');
      const children = item.querySelector('.folder-tree-children');
      const isOpen = arrow.classList.toggle('open');
      children.classList.toggle('hidden', !isOpen);
      updateFolderListItems();
    });
  });

  // Add selection handlers
  folderList.querySelectorAll('.folder-tree-row').forEach(row => {
    row.addEventListener('click', () => {
      const item = row.closest('.folder-tree-item');
      folderList.querySelectorAll('.folder-tree-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      selectedFolderIndex = folderListItems.indexOf(row);
    });
  });

  updateFolderListItems();
  if (folderListItems.length > 0) {
    folderListItems[0].classList.add('selected');
    selectedFolderIndex = 0;
  }

  showModal(moveModal);
}

// Update the list of visible folder items for keyboard navigation
function updateFolderListItems() {
  folderListItems = Array.from(document.getElementById('folder-list').querySelectorAll('.folder-tree-row')).filter(row => {
    // Check if all parent folder-tree-children are visible
    let parent = row.parentElement;
    while (parent && parent.id !== 'folder-list') {
      if (parent.classList.contains('folder-tree-children') && parent.classList.contains('hidden')) {
        return false;
      }
      parent = parent.parentElement;
    }
    return true;
  });
}

// Get all descendant folder IDs (to exclude when moving a folder)
function getDescendantFolderIds(node, parentId, collecting = false) {
  let ids = [];

  if (node.id === parentId) {
    collecting = true;
  }

  if (node.children) {
    for (const child of node.children) {
      if (collecting && child.children) {
        ids.push(child.id);
      }
      ids = ids.concat(getDescendantFolderIds(child, parentId, collecting));
    }
  }

  return ids;
}

function updateFolderSelection() {
  document.getElementById('folder-list').querySelectorAll('.folder-tree-row').forEach(row => {
    row.classList.remove('selected');
  });
  if (folderListItems[selectedFolderIndex]) {
    folderListItems[selectedFolderIndex].classList.add('selected');
    folderListItems[selectedFolderIndex].scrollIntoView({ block: 'nearest' });
  }
}

// Render folder tree HTML for move modal (with bookmarks)
function renderFolderTree(node, excludeIds = [], depth = 0, movingItemId = null) {
  let html = '';

  if (node.children) {
    const childFolders = node.children.filter(c => c.children && !excludeIds.includes(c.id));
    const childBookmarks = node.children.filter(c => c.url && c.id !== movingItemId);
    const hasChildren = childFolders.length > 0 || childBookmarks.length > 0;

    // Add this folder if it has a title and is not excluded
    if (node.title && !excludeIds.includes(node.id)) {
      html += `
        <div class="folder-tree-item" data-folder-id="${node.id}" data-type="folder">
          <div class="folder-tree-row" style="padding-left: ${12 + depth * 20}px;">
            <span class="folder-tree-arrow ${hasChildren ? '' : 'hidden'}">▶</span>
            <span class="folder-icon">📁</span>
            <span class="folder-tree-name">${escapeHtml(node.title)}</span>
          </div>
          ${hasChildren ? `<div class="folder-tree-children hidden">` : ''}
      `;
    }

    // Combine all children and sort by index to show in actual order
    const allChildren = [
      ...childFolders.map(c => ({ ...c, isFolder: true })),
      ...childBookmarks.map(c => ({ ...c, isFolder: false }))
    ].sort((a, b) => a.index - b.index);

    const childDepth = node.title ? depth + 1 : depth;

    // Render all children in order
    for (const child of allChildren) {
      if (child.isFolder) {
        html += renderFolderTree(child, excludeIds, childDepth, movingItemId);
      } else {
        html += `
          <div class="folder-tree-item" data-bookmark-id="${child.id}" data-parent-id="${node.id}" data-index="${child.index}" data-type="bookmark">
            <div class="folder-tree-row bookmark-row" style="padding-left: ${12 + childDepth * 20}px;">
              <span class="folder-tree-arrow hidden">▶</span>
              <span class="bookmark-icon">📄</span>
              <span class="folder-tree-name">${escapeHtml(child.title || child.url)}</span>
            </div>
          </div>
        `;
      }
    }

    if (node.title && !excludeIds.includes(node.id) && hasChildren) {
      html += `</div></div>`;
    } else if (node.title && !excludeIds.includes(node.id)) {
      html += `</div>`;
    }
  }

  return html;
}

// placementMode: 'default', 'after', 'before'
async function confirmMove(placementMode = 'default') {
  if (!currentBookmarkId || !folderListItems[selectedFolderIndex]) return;

  const selectedRow = folderListItems[selectedFolderIndex];
  const item = selectedRow.closest('.folder-tree-item');
  const itemType = item.dataset.type;

  try {
    // Save old position for undo
    const [bookmarkInfo] = await browser.bookmarks.get(currentBookmarkId);
    const oldParentId = bookmarkInfo.parentId;
    const oldIndex = bookmarkInfo.index;

    let moveOptions;

    if (placementMode === 'after' || placementMode === 'before') {
      // Get parent folder of selected item
      const parentItem = item.parentElement.closest('.folder-tree-item');
      const parentId = parentItem ? parentItem.dataset.folderId : item.dataset.parentId;

      // Get the index of the selected item
      const selectedIndex = itemType === 'folder'
        ? parseInt(item.dataset.folderIndex || '0', 10)
        : parseInt(item.dataset.index, 10);

      // For 'after' we insert at index + 1, for 'before' at index
      const targetIndex = placementMode === 'after' ? selectedIndex + 1 : selectedIndex;

      // Need to find actual parent - for folders it's tricky
      if (itemType === 'folder') {
        // Get folder's parent from bookmark API
        const folderInfo = await browser.bookmarks.get(item.dataset.folderId);
        moveOptions = {
          parentId: folderInfo[0].parentId,
          index: placementMode === 'after' ? folderInfo[0].index + 1 : folderInfo[0].index
        };
      } else {
        moveOptions = { parentId: parentId, index: targetIndex };
      }
    } else if (itemType === 'bookmark') {
      // Move after the selected bookmark
      const parentId = item.dataset.parentId;
      const bookmarkIndex = parseInt(item.dataset.index, 10);
      moveOptions = { parentId: parentId, index: bookmarkIndex + 1 };
    } else {
      // Move to folder (at the end)
      moveOptions = { parentId: item.dataset.folderId };
    }

    await browser.bookmarks.move(currentBookmarkId, moveOptions);

    // Push to undo stack
    undoStack.push({
      type: 'move',
      data: {
        id: currentBookmarkId,
        oldParentId: oldParentId,
        oldIndex: oldIndex
      }
    });

    hideModal();

    // Re-render the entire bookmarks tree to show changes
    await renderBookmarksTree();
    updateVisibleItems();
  } catch (e) {
    console.error('Failed to move:', e);
  }
}

// New Bookmark Modal
async function showNewBookmarkModal(preselectedId = null) {
  document.getElementById('new-bookmark-title').value = '';
  document.getElementById('new-bookmark-url').value = '';

  const folderList = document.getElementById('new-bookmark-folder-list');
  const tree = await browser.bookmarks.getTree();
  folderList.innerHTML = renderFolderTreeSimple(tree[0]);

  setupFolderListNavigation(folderList, preselectedId);

  // Ensure at least first folder is selected
  if (!folderList.querySelector('.folder-tree-row.selected') && newItemFolderListItems.length > 0) {
    newItemFolderListItems[0].classList.add('selected');
    selectedFolderIndex = 0;
  }

  showModal(newBookmarkModal);
  document.getElementById('new-bookmark-title').focus();
}

async function confirmNewBookmark(forceAdd = false) {
  const title = document.getElementById('new-bookmark-title').value.trim();
  let url = document.getElementById('new-bookmark-url').value.trim();

  if (!title || !url) {
    // Focus on empty field
    if (!title) document.getElementById('new-bookmark-title').focus();
    else document.getElementById('new-bookmark-url').focus();
    return;
  }

  // Auto-add https:// if no protocol specified
  if (url && !url.match(/^[a-zA-Z]+:\/\//)) {
    url = 'https://' + url;
  }

  // Find selected folder
  const folderList = document.getElementById('new-bookmark-folder-list');
  const selectedRow = folderList.querySelector('.folder-tree-row.selected');
  if (!selectedRow) {
    // Select first visible folder if none selected
    const firstRow = newItemFolderListItems[0];
    if (firstRow) firstRow.classList.add('selected');
    else return;
  }

  const parentId = (selectedRow || newItemFolderListItems[0]).closest('.folder-tree-item').dataset.folderId;

  // Check for duplicates (unless forceAdd is true or disabled in settings)
  if (!forceAdd && appSettings.warnDuplicateUrl !== false) {
    const duplicates = findDuplicates(url);
    if (duplicates.length > 0) {
      // Store pending bookmark data
      pendingBookmark = { title, url, parentId };
      showDuplicateWarning(duplicates);
      return;
    }
  }

  try {
    const newBookmark = await browser.bookmarks.create({ title, url, parentId });

    // Push to undo stack
    undoStack.push({
      type: 'create-bookmark',
      data: { id: newBookmark.id }
    });

    hideModal();
    await renderBookmarksTree();
    updateVisibleItems();
  } catch (e) {
    console.error('Failed to create bookmark:', e);
  }
}

// Show duplicate warning modal
function showDuplicateWarning(duplicates) {
  const duplicateList = document.getElementById('duplicate-list');

  duplicateList.innerHTML = duplicates.map(b => `
    <div class="duplicate-item">
      <div class="duplicate-item-title">${escapeHtml(b.title)}</div>
      <div class="duplicate-item-path">${escapeHtml(b.folderPath.join(' / ') || t('duplicate.rootFolder'))}</div>
    </div>
  `).join('');

  // Hide new bookmark modal but keep overlay
  newBookmarkModal.classList.add('hidden');
  duplicateModal.classList.remove('hidden');
  // Focus overlay for keyboard navigation
  modalOverlay.focus();
}

// Confirm adding duplicate bookmark
async function confirmAddDuplicate() {
  if (!pendingBookmark) return;

  const { title, url, parentId } = pendingBookmark;
  pendingBookmark = null;

  try {
    const newBookmark = await browser.bookmarks.create({ title, url, parentId });

    // Push to undo stack
    undoStack.push({
      type: 'create-bookmark',
      data: { id: newBookmark.id }
    });

    hideModal();
    await renderBookmarksTree();
    updateVisibleItems();
  } catch (e) {
    console.error('Failed to create bookmark:', e);
  }
}

// Cancel adding duplicate - go back to new bookmark modal
function cancelDuplicate() {
  pendingBookmark = null;
  duplicateModal.classList.add('hidden');
  newBookmarkModal.classList.remove('hidden');
  document.getElementById('new-bookmark-url').focus();
}

// New Folder Modal
async function showNewFolderModal(preselectedId = null) {
  document.getElementById('new-folder-name').value = '';

  const folderList = document.getElementById('new-folder-folder-list');
  const tree = await browser.bookmarks.getTree();
  folderList.innerHTML = renderFolderTreeSimple(tree[0]);

  setupFolderListNavigation(folderList, preselectedId);

  // Ensure at least first folder is selected
  if (!folderList.querySelector('.folder-tree-row.selected') && newItemFolderListItems.length > 0) {
    newItemFolderListItems[0].classList.add('selected');
    selectedFolderIndex = 0;
  }

  showModal(newFolderModal);
  document.getElementById('new-folder-name').focus();
}

// Generate unique folder name if one with same name exists
async function getUniqueFolderName(title, parentId) {
  try {
    const children = await browser.bookmarks.getChildren(parentId);
    const existingFolders = children
      .filter(c => !c.url) // Only folders
      .map(c => c.title.toLowerCase());

    if (!existingFolders.includes(title.toLowerCase())) {
      return title; // Name is unique
    }

    // Find next available number
    let counter = 1;
    let newTitle;
    do {
      newTitle = `${title} (${counter})`;
      counter++;
    } while (existingFolders.includes(newTitle.toLowerCase()));

    return newTitle;
  } catch (e) {
    return title;
  }
}

async function confirmNewFolder() {
  let title = document.getElementById('new-folder-name').value.trim();

  if (!title) {
    document.getElementById('new-folder-name').focus();
    return;
  }

  // Find selected folder
  const folderList = document.getElementById('new-folder-folder-list');
  const selectedRow = folderList.querySelector('.folder-tree-row.selected');
  if (!selectedRow) {
    const firstRow = newItemFolderListItems[0];
    if (firstRow) firstRow.classList.add('selected');
    else return;
  }

  const parentId = (selectedRow || newItemFolderListItems[0]).closest('.folder-tree-item').dataset.folderId;

  // Get unique name if folder with same name exists
  title = await getUniqueFolderName(title, parentId);

  try {
    const newFolder = await browser.bookmarks.create({ title, parentId });

    // Push to undo stack
    undoStack.push({
      type: 'create-folder',
      data: { id: newFolder.id }
    });

    hideModal();
    await renderBookmarksTree();
    updateVisibleItems();
  } catch (e) {
    console.error('Failed to create folder:', e);
  }
}

// Render simple folder tree (folders only, for selection)
function renderFolderTreeSimple(node, depth = 0) {
  let html = '';

  if (node.children) {
    const childFolders = node.children.filter(c => c.children);
    const hasChildren = childFolders.length > 0;

    if (node.title) {
      html += `
        <div class="folder-tree-item" data-folder-id="${node.id}" data-type="folder">
          <div class="folder-tree-row" style="padding-left: ${12 + depth * 20}px;">
            <span class="folder-tree-arrow ${hasChildren ? '' : 'hidden'}">▶</span>
            <span class="folder-icon">📁</span>
            <span class="folder-tree-name">${escapeHtml(node.title)}</span>
          </div>
          ${hasChildren ? `<div class="folder-tree-children hidden">` : ''}
      `;
    }

    for (const child of childFolders) {
      html += renderFolderTreeSimple(child, node.title ? depth + 1 : depth);
    }

    if (node.title && hasChildren) {
      html += `</div></div>`;
    } else if (node.title) {
      html += `</div>`;
    }
  }

  return html;
}

// Setup folder list navigation and selection
function setupFolderListNavigation(folderList, preselectedId = null) {
  // Add expand/collapse handlers
  folderList.querySelectorAll('.folder-tree-arrow:not(.hidden)').forEach(arrow => {
    arrow.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = arrow.closest('.folder-tree-item');
      const children = item.querySelector('.folder-tree-children');
      const isOpen = arrow.classList.toggle('open');
      children.classList.toggle('hidden', !isOpen);
      updateNewItemFolderList(folderList);
    });
  });

  // Add selection handlers
  folderList.querySelectorAll('.folder-tree-row').forEach(row => {
    row.addEventListener('click', () => {
      folderList.querySelectorAll('.folder-tree-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      selectedFolderIndex = newItemFolderListItems.indexOf(row);
    });
  });

  updateNewItemFolderList(folderList);

  // Pre-select folder if specified
  if (preselectedId) {
    const preselectedItem = folderList.querySelector(`[data-folder-id="${preselectedId}"]`);
    if (preselectedItem) {
      // Expand parents
      let parent = preselectedItem.parentElement;
      while (parent && parent !== folderList) {
        if (parent.classList.contains('folder-tree-children')) {
          parent.classList.remove('hidden');
          const arrow = parent.parentElement.querySelector('.folder-tree-arrow');
          if (arrow) arrow.classList.add('open');
        }
        parent = parent.parentElement;
      }
      updateNewItemFolderList(folderList);

      const row = preselectedItem.querySelector('.folder-tree-row');
      if (row) {
        folderList.querySelectorAll('.folder-tree-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        selectedFolderIndex = newItemFolderListItems.indexOf(row);
      }
    }
  } else if (newItemFolderListItems.length > 0) {
    newItemFolderListItems[0].classList.add('selected');
    selectedFolderIndex = 0;
  }
}

function updateNewItemFolderList(folderList) {
  newItemFolderListItems = Array.from(folderList.querySelectorAll('.folder-tree-row')).filter(row => {
    let parent = row.parentElement;
    while (parent && parent !== folderList) {
      if (parent.classList.contains('folder-tree-children') && parent.classList.contains('hidden')) {
        return false;
      }
      parent = parent.parentElement;
    }
    return true;
  });
}

function updateNewItemFolderSelection() {
  const activeModal = !newBookmarkModal.classList.contains('hidden') ? newBookmarkModal : newFolderModal;
  const folderList = activeModal.querySelector('.folder-list');

  folderList.querySelectorAll('.folder-tree-row').forEach(row => {
    row.classList.remove('selected');
  });
  if (newItemFolderListItems[selectedFolderIndex]) {
    newItemFolderListItems[selectedFolderIndex].classList.add('selected');
    newItemFolderListItems[selectedFolderIndex].scrollIntoView({ block: 'nearest' });
  }
}

// Modal button handlers
deleteModal.querySelector('[data-action="cancel"]').addEventListener('click', hideModal);
deleteModal.querySelector('[data-action="confirm"]').addEventListener('click', confirmDelete);

editModal.querySelector('[data-action="cancel"]').addEventListener('click', hideModal);
editModal.querySelector('[data-action="confirm"]').addEventListener('click', confirmEdit);

moveModal.querySelector('[data-action="cancel"]').addEventListener('click', hideModal);
moveModal.querySelector('[data-action="confirm"]').addEventListener('click', confirmMove);

newBookmarkModal.querySelector('[data-action="cancel"]').addEventListener('click', hideModal);
newBookmarkModal.querySelector('[data-action="confirm"]').addEventListener('click', confirmNewBookmark);

newFolderModal.querySelector('[data-action="cancel"]').addEventListener('click', hideModal);
newFolderModal.querySelector('[data-action="confirm"]').addEventListener('click', confirmNewFolder);

duplicateModal.querySelector('[data-action="cancel"]').addEventListener('click', cancelDuplicate);
duplicateModal.querySelector('[data-action="confirm"]').addEventListener('click', confirmAddDuplicate);

// Add button and menu
addButton.addEventListener('click', (e) => {
  e.stopPropagation();
  addMenu.classList.toggle('hidden');
});

addMenu.addEventListener('click', (e) => {
  const item = e.target.closest('.add-menu-item');
  if (!item) return;

  const action = item.dataset.action;
  addMenu.classList.add('hidden');

  if (action === 'new-bookmark') {
    showNewBookmarkModal();
  } else if (action === 'new-folder') {
    showNewFolderModal();
  }
});

// Hide add menu when clicking outside
document.addEventListener('click', (e) => {
  if (!addButton.contains(e.target) && !addMenu.contains(e.target)) {
    addMenu.classList.add('hidden');
  }
});

// Modal keyboard navigation
modalOverlay.addEventListener('keydown', (e) => {
  if (modalOverlay.classList.contains('hidden')) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    // Handle duplicate modal specially - go back to new bookmark modal
    if (!duplicateModal.classList.contains('hidden')) {
      cancelDuplicate();
      return;
    }
    hideModal();
    return;
  }

  // Handle duplicate modal - Enter confirms
  if (!duplicateModal.classList.contains('hidden') && e.key === 'Enter') {
    e.preventDefault();
    confirmAddDuplicate();
    return;
  }

  // Handle move modal navigation
  if (!moveModal.classList.contains('hidden')) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedFolderIndex = Math.min(selectedFolderIndex + 1, folderListItems.length - 1);
      updateFolderSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedFolderIndex = Math.max(selectedFolderIndex - 1, 0);
      updateFolderSelection();
    } else if (e.key === 'ArrowRight') {
      // Expand folder
      e.preventDefault();
      const selectedRow = folderListItems[selectedFolderIndex];
      if (selectedRow) {
        const item = selectedRow.closest('.folder-tree-item');
        const arrow = item.querySelector('.folder-tree-arrow:not(.hidden)');
        const children = item.querySelector('.folder-tree-children');
        if (arrow && children && !arrow.classList.contains('open')) {
          arrow.classList.add('open');
          children.classList.remove('hidden');
          updateFolderListItems();
        }
      }
    } else if (e.key === 'ArrowLeft') {
      // Collapse folder or go to parent
      e.preventDefault();
      const selectedRow = folderListItems[selectedFolderIndex];
      if (selectedRow) {
        const item = selectedRow.closest('.folder-tree-item');
        const arrow = item.querySelector('.folder-tree-arrow:not(.hidden)');
        const children = item.querySelector('.folder-tree-children');
        if (arrow && children && arrow.classList.contains('open')) {
          arrow.classList.remove('open');
          children.classList.add('hidden');
          updateFolderListItems();
          updateFolderSelection();
        }
      }
    } else if (e.key === 'Enter' && !e.target.classList.contains('modal-input')) {
      e.preventDefault();
      if (e.ctrlKey && e.shiftKey) {
        // Ctrl+Shift+Enter - insert before
        confirmMove('before');
      } else if (e.ctrlKey) {
        // Ctrl+Enter - insert after (at same level)
        confirmMove('after');
      } else {
        // Enter - default behavior
        confirmMove('default');
      }
    }
    return;
  }

  // Handle delete modal
  if (!deleteModal.classList.contains('hidden') && e.key === 'Enter') {
    e.preventDefault();
    confirmDelete();
    return;
  }

  // Handle edit modal - Enter confirms (in input fields too)
  if (!editModal.classList.contains('hidden') && e.key === 'Enter') {
    e.preventDefault();
    confirmEdit();
    return;
  }

  // Handle new bookmark/folder modal navigation
  if (!newBookmarkModal.classList.contains('hidden') || !newFolderModal.classList.contains('hidden')) {
    const activeModal = !newBookmarkModal.classList.contains('hidden') ? newBookmarkModal : newFolderModal;
    const folderList = activeModal.querySelector('.folder-list');
    const inInput = e.target.classList.contains('modal-input');

    // Allow Ctrl+Arrow or just Arrow (when not in input) for folder navigation
    const canNavigate = !inInput || e.ctrlKey;

    if (e.key === 'ArrowDown' && canNavigate) {
      e.preventDefault();
      selectedFolderIndex = Math.min(selectedFolderIndex + 1, newItemFolderListItems.length - 1);
      updateNewItemFolderSelection();
    } else if (e.key === 'ArrowUp' && canNavigate) {
      e.preventDefault();
      selectedFolderIndex = Math.max(selectedFolderIndex - 1, 0);
      updateNewItemFolderSelection();
    } else if (e.key === 'ArrowRight' && canNavigate) {
      e.preventDefault();
      const selectedRow = newItemFolderListItems[selectedFolderIndex];
      if (selectedRow) {
        const item = selectedRow.closest('.folder-tree-item');
        const arrow = item.querySelector('.folder-tree-arrow:not(.hidden)');
        const children = item.querySelector('.folder-tree-children');
        if (arrow && children && !arrow.classList.contains('open')) {
          arrow.classList.add('open');
          children.classList.remove('hidden');
          updateNewItemFolderList(folderList);
        }
      }
    } else if (e.key === 'ArrowLeft' && canNavigate) {
      e.preventDefault();
      const selectedRow = newItemFolderListItems[selectedFolderIndex];
      if (selectedRow) {
        const item = selectedRow.closest('.folder-tree-item');
        const arrow = item.querySelector('.folder-tree-arrow:not(.hidden)');
        const children = item.querySelector('.folder-tree-children');
        if (arrow && children && arrow.classList.contains('open')) {
          arrow.classList.remove('open');
          children.classList.add('hidden');
          updateNewItemFolderList(folderList);
          updateNewItemFolderSelection();
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!newBookmarkModal.classList.contains('hidden')) {
        confirmNewBookmark();
      } else {
        confirmNewFolder();
      }
    }
    return;
  }
});

// Close modal when clicking on overlay (outside modal content)
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    // Handle duplicate modal specially - go back to new bookmark modal
    if (!duplicateModal.classList.contains('hidden')) {
      cancelDuplicate();
      return;
    }
    hideModal();
  }
});

// Restore focus when returning to the tab
window.addEventListener('focus', () => {
  // Hide context menu and add menu if open
  hideContextMenu();
  addMenu.classList.add('hidden');
  // Only focus search if no modal is open (with small delay for browser readiness)
  if (modalOverlay.classList.contains('hidden')) {
    setTimeout(() => searchInput.focus(), 10);
  }
});

// Hide context menu and add menu when window loses focus
window.addEventListener('blur', () => {
  hideContextMenu();
  addMenu.classList.add('hidden');
});

// Stats functions
async function showStats() {
  // Count folders
  const tree = await browser.bookmarks.getTree();
  const folderCount = countFolders(tree[0]);

  // Bookmarks count
  const bookmarksCount = allBookmarks.length;

  // Domains
  const domains = {};
  allBookmarks.forEach(b => {
    try {
      const domain = new URL(b.url).hostname.replace(/^www\./, '');
      domains[domain] = (domains[domain] || 0) + 1;
    } catch {}
  });
  const domainsCount = Object.keys(domains).length;

  // Total visits
  const totalVisits = Object.values(clickCounts).reduce((a, b) => a + b, 0);

  // Update cards
  document.getElementById('stats-bookmarks-count').textContent = bookmarksCount;
  document.getElementById('stats-folders-count').textContent = folderCount;
  document.getElementById('stats-domains-count').textContent = domainsCount;
  document.getElementById('stats-visits-count').textContent = totalVisits;

  // Top visited
  const topVisited = allBookmarks
    .filter(b => clickCounts[b.url] > 0)
    .sort((a, b) => (clickCounts[b.url] || 0) - (clickCounts[a.url] || 0))
    .slice(0, appSettings.statsTopVisited ?? 10);

  document.getElementById('stats-top-visited').innerHTML = topVisited.length > 0
    ? topVisited.map(b => `
      <div class="stats-list-item">
        <img src="${getFaviconUrl(b.url)}" alt="">
        <span class="stats-list-item-title">${escapeHtml(b.title)}</span>
        <span class="stats-list-item-count">${t('stats.visitCount', { count: clickCounts[b.url] })}</span>
      </div>
    `).join('')
    : `<p style="color: var(--ctp-subtext0); font-size: 12px;">${t('stats.noVisits')}</p>`;

  // Folders chart
  const folderStats = {};
  allBookmarks.forEach(b => {
    const folder = b.folderPath[b.folderPath.length - 1] || t('stats.rootFolder');
    folderStats[folder] = (folderStats[folder] || 0) + 1;
  });

  const topFolders = Object.entries(folderStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, appSettings.statsTopFolders ?? 8);

  const maxFolderCount = topFolders[0]?.[1] || 1;

  document.getElementById('stats-folders-chart').innerHTML = topFolders.map(([name, count]) => `
    <div class="stats-chart-row">
      <span class="stats-chart-label" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
      <div class="stats-chart-bar-container">
        <div class="stats-chart-bar" style="width: ${(count / maxFolderCount) * 100}%"></div>
      </div>
      <span class="stats-chart-value">${count}</span>
    </div>
  `).join('');

  // Domains chart
  const topDomains = Object.entries(domains)
    .sort((a, b) => b[1] - a[1])
    .slice(0, appSettings.statsTopDomains ?? 8);

  const maxDomainCount = topDomains[0]?.[1] || 1;

  document.getElementById('stats-domains-chart').innerHTML = topDomains.map(([domain, count]) => `
    <div class="stats-chart-row">
      <span class="stats-chart-label" title="${escapeHtml(domain)}">${escapeHtml(domain)}</span>
      <div class="stats-chart-bar-container">
        <div class="stats-chart-bar" style="width: ${(count / maxDomainCount) * 100}%"></div>
      </div>
      <span class="stats-chart-value">${count}</span>
    </div>
  `).join('');

  showModal(statsModal);
}

function countFolders(node) {
  let count = 0;
  if (node.children) {
    for (const child of node.children) {
      if (!child.url) {
        count++;
        count += countFolders(child);
      }
    }
  }
  return count;
}

// Stats button handler
statsButton.addEventListener('click', showStats);
statsModal.querySelector('[data-action="cancel"]').addEventListener('click', hideModal);

// Help function
function renderHelpModal() {
  const container = document.getElementById('help-sections-container');
  const sc = getShortcuts();
  let html = '';

  for (const cat of SHORTCUT_CATEGORIES) {
    html += `<div class="help-section"><h3>${t(cat.titleKey)}</h3><div class="help-shortcuts">`;
    for (const s of cat.shortcuts) {
      const def = sc[s.id];
      html += `<div class="help-shortcut"><span class="help-key">${formatShortcut(def)}</span><span>${t(s.labelKey)}</span></div>`;
    }
    html += '</div></div>';
  }

  // Static "In modals" section
  html += `<div class="help-section"><h3>${t('modal.help.modals')}</h3><div class="help-shortcuts">
    <div class="help-shortcut"><span class="help-key">Esc</span><span>${t('modal.help.closeModal')}</span></div>
    <div class="help-shortcut"><span class="help-key">Enter</span><span>${t('modal.help.confirmAction')}</span></div>
    <div class="help-shortcut"><span class="help-key">↑ ↓ ← →</span><span>${t('modal.help.folderNav')}</span></div>
    <div class="help-shortcut"><span class="help-key">Ctrl+↑ ↓ ← →</span><span>${t('modal.help.folderNavInput')}</span></div>
    <div class="help-shortcut"><span class="help-key">Ctrl+Enter</span><span>${t('modal.help.moveAfter')}</span></div>
    <div class="help-shortcut"><span class="help-key">Ctrl+Shift+Enter</span><span>${t('modal.help.moveBefore')}</span></div>
  </div></div>`;

  container.innerHTML = html;
}

function showHelp() {
  renderHelpModal();
  showModal(helpModal);
}

// Help button handler
helpButton.addEventListener('click', showHelp);
helpModal.querySelector('[data-action="cancel"]').addEventListener('click', hideModal);

// ==================== SETTINGS ====================

async function loadSettings() {
  try {
    const result = await browser.storage.local.get('appSettings');
    if (result.appSettings) {
      appSettings = { ...DEFAULT_SETTINGS, ...result.appSettings };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  applySettings();
  renderSettingsUI();
  updateShortcutDisplays();
}

async function saveSettings() {
  try {
    await browser.storage.local.set({ appSettings });
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

function applySettings() {
  const root = document.documentElement;
  const theme = THEMES[appSettings.theme] || THEMES.macchiato;

  // Apply theme colors (base)
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--ctp-${key}`, value);
  }

  // Apply custom color overrides on top of theme
  const custom = appSettings.customColors || {};
  for (const [key, value] of Object.entries(custom)) {
    root.style.setProperty(`--ctp-${key}`, value);
  }

  // Apply accent color (custom override takes priority)
  const accentKey = appSettings.accentColor || 'mauve';
  const accentHex = custom[accentKey] || theme.colors[accentKey] || theme.colors.mauve;
  root.style.setProperty('--ctp-accent', accentHex);

  // Apply other settings
  root.style.setProperty('--bg-opacity', appSettings.bgOpacity);
  root.style.setProperty('--content-max-width', appSettings.contentMaxWidth + 'px');
  root.style.setProperty('--search-font-size', appSettings.searchFontSize + 'px');

  // Density
  document.body.classList.remove('density-compact', 'density-normal', 'density-spacious');
  document.body.classList.add(`density-${appSettings.density}`);

  // Visit count visibility
  document.body.classList.toggle('hide-visit-count', !appSettings.showVisitCount);

  // Search placeholder
  const customPlaceholder = appSettings.searchPlaceholder;
  searchInput.placeholder = (customPlaceholder && customPlaceholder !== 'Search bookmarks...' && customPlaceholder !== 'Szukaj zakładek...') ? customPlaceholder : t('search.defaultPlaceholder');

  // Button visibility
  helpButton.classList.toggle('btn-hidden', !appSettings.showHelpButton);
  statsButton.classList.toggle('btn-hidden', !appSettings.showStatsButton);
  document.getElementById('add-button-container').classList.toggle('btn-hidden', !appSettings.showAddButton);
  bgButton.classList.toggle('btn-hidden', !appSettings.showBgButton);

  // Buttons position
  const floatingButtons = document.getElementById('floating-buttons');
  floatingButtons.classList.remove('pos-bottom-right', 'pos-bottom-left', 'pos-top-right', 'pos-top-left');
  const pos = appSettings.buttonsPosition || 'bottom-right';
  if (pos !== 'bottom-right') floatingButtons.classList.add(`pos-${pos}`);

  // Buttons order
  const orderMap = {
    'help': helpButton,
    'stats': statsButton,
    'add': document.getElementById('add-button-container'),
    'settings': settingsButton,
    'bg': bgButton
  };
  const order = appSettings.buttonsOrder || ['help', 'stats', 'add', 'settings', 'bg'];
  for (const id of order) {
    const el = orderMap[id];
    if (el) floatingButtons.appendChild(el);
  }

  // Pinned bar
  document.body.classList.toggle('pinned-show-empty', !!appSettings.pinnedShowEmpty);
  document.body.classList.remove('pinned-size-small', 'pinned-size-large');
  const iconSize = appSettings.pinnedIconSize || 'normal';
  if (iconSize !== 'normal') document.body.classList.add(`pinned-size-${iconSize}`);
}

function renderSettingsUI() {
  // Language selector
  document.getElementById('settings-language-select').value = currentLang;

  // Theme cards
  const themeGrid = document.getElementById('settings-theme-grid');
  themeGrid.innerHTML = '';
  const hasCustom = Object.keys(appSettings.customColors || {}).length > 0;
  for (const [id, theme] of Object.entries(THEMES)) {
    const card = document.createElement('button');
    const isThemeActive = appSettings.theme === id && !hasCustom;
    card.className = `settings-theme-card${isThemeActive ? ' active' : ''}`;
    card.dataset.theme = id;
    const previewColors = ['base', 'surface0', 'surface1', 'surface2', 'text'];
    card.innerHTML = `
      <div class="settings-theme-preview">
        ${previewColors.map(c => `<span style="background:${theme.colors[c]}"></span>`).join('')}
      </div>
      <div class="settings-theme-name">${theme.name}</div>
      <div class="settings-theme-label">${t(theme.labelKey)}</div>
    `;
    card.addEventListener('click', () => {
      appSettings.theme = id;
      appSettings.customColors = {};
      applySettings();
      saveSettings();
      renderSettingsUI();
    });
    themeGrid.appendChild(card);
  }

  // Custom/preset card
  const saved = appSettings.savedPreset;
  if (saved) {
    const customCard = document.createElement('button');
    const savedTheme = THEMES[saved.theme] || THEMES.macchiato;
    const savedMerged = { ...savedTheme.colors, ...(saved.customColors || {}) };
    const previewColors = ['base', 'surface0', 'surface1', 'surface2', 'text'];
    const isPresetActive = Object.keys(appSettings.customColors || {}).length > 0
      || (appSettings.theme === saved.theme && saved.name);
    const currentMatchesSaved = appSettings.theme === saved.theme
      && JSON.stringify(appSettings.customColors || {}) === JSON.stringify(saved.customColors || {})
      && appSettings.accentColor === saved.accentColor;
    customCard.className = `settings-theme-card${currentMatchesSaved ? ' active' : ''}`;
    customCard.innerHTML = `
      <div class="settings-theme-preview">
        ${previewColors.map(c => `<span style="background:${savedMerged[c]}"></span>`).join('')}
      </div>
      <div class="settings-theme-name">${escapeHtml(saved.name || t('presets.custom'))}</div>
      <div class="settings-theme-label">${t('presets.preset')}</div>
    `;
    customCard.addEventListener('click', () => {
      appSettings.theme = saved.theme;
      appSettings.accentColor = saved.accentColor;
      appSettings.customColors = { ...(saved.customColors || {}) };
      applySettings();
      saveSettings();
      renderSettingsUI();
    });
    themeGrid.appendChild(customCard);
  }

  // Accent colors
  const accentGrid = document.getElementById('settings-accent-grid');
  accentGrid.innerHTML = '';
  const currentTheme = THEMES[appSettings.theme] || THEMES.macchiato;
  const custom = appSettings.customColors || {};
  for (const color of ACCENT_COLORS) {
    const dot = document.createElement('button');
    dot.className = `settings-accent-dot${appSettings.accentColor === color ? ' active' : ''}`;
    dot.style.backgroundColor = custom[color] || currentTheme.colors[color];
    dot.title = color;
    dot.addEventListener('click', () => {
      appSettings.accentColor = color;
      applySettings();
      saveSettings();
      renderSettingsUI();
    });
    accentGrid.appendChild(dot);
  }

  // Custom colors
  renderCustomColors(currentTheme, custom);

  // Sliders and values
  const bgSlider = document.getElementById('settings-bg-opacity');
  bgSlider.value = appSettings.bgOpacity;
  document.getElementById('settings-bg-opacity-value').textContent = appSettings.bgOpacity;

  const widthSlider = document.getElementById('settings-content-width');
  widthSlider.value = appSettings.contentMaxWidth;
  document.getElementById('settings-width-value').textContent = appSettings.contentMaxWidth + 'px';

  const fontSlider = document.getElementById('settings-search-font');
  fontSlider.value = appSettings.searchFontSize;
  document.getElementById('settings-font-value').textContent = appSettings.searchFontSize + 'px';

  // Density
  document.querySelectorAll('.settings-density-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.density === appSettings.density);
  });

  // Visit count toggle
  document.getElementById('settings-show-visits').checked = appSettings.showVisitCount;

  // Navigation settings
  document.getElementById('settings-double-click').checked = appSettings.doubleClickToOpen;
  document.getElementById('settings-middle-click').checked = appSettings.middleClickNewTab;
  document.querySelectorAll('.settings-folder-state-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.folderState === appSettings.folderStartState);
  });

  // Default folder states
  renderDefaultFolderStates();

  // Warnings
  document.getElementById('settings-warn-duplicate').checked = appSettings.warnDuplicateUrl !== false;

  const thresholdSlider = document.getElementById('settings-open-all-threshold');
  thresholdSlider.value = appSettings.openAllThreshold ?? 5;
  document.getElementById('settings-open-all-threshold-value').textContent = (appSettings.openAllThreshold ?? 5) === 0 ? t('settings.navigation.openAllDisabled') : appSettings.openAllThreshold ?? 5;

  // Search settings
  const debounceSlider = document.getElementById('settings-search-debounce');
  debounceSlider.value = appSettings.searchDebounce ?? 100;
  document.getElementById('settings-debounce-value').textContent = (appSettings.searchDebounce ?? 100) + 'ms';

  document.querySelectorAll('.settings-search-scope-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.scope === (appSettings.searchScope || 'both'));
  });

  const settingsPlaceholder = appSettings.searchPlaceholder;
  document.getElementById('settings-search-placeholder').value = (settingsPlaceholder && settingsPlaceholder !== 'Search bookmarks...' && settingsPlaceholder !== 'Szukaj zakładek...') ? settingsPlaceholder : t('search.defaultPlaceholder');

  // Pinned settings
  const pinnedLimitSlider = document.getElementById('settings-pinned-limit');
  pinnedLimitSlider.value = appSettings.pinnedLimit ?? 10;
  document.getElementById('settings-pinned-limit-value').textContent = appSettings.pinnedLimit ?? 10;

  document.getElementById('settings-pinned-show-empty').checked = !!appSettings.pinnedShowEmpty;

  document.querySelectorAll('.settings-pinned-size-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pinnedSize === (appSettings.pinnedIconSize || 'normal'));
  });

  // Button visibility
  document.getElementById('settings-show-help-btn').checked = appSettings.showHelpButton !== false;
  document.getElementById('settings-show-stats-btn').checked = appSettings.showStatsButton !== false;
  document.getElementById('settings-show-add-btn').checked = appSettings.showAddButton !== false;
  document.getElementById('settings-show-bg-btn').checked = appSettings.showBgButton !== false;

  // Buttons position
  document.querySelectorAll('.settings-position-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.position === (appSettings.buttonsPosition || 'bottom-right'));
  });

  // Buttons order
  renderButtonsOrder();

  // Stats settings
  const statsVisitedSlider = document.getElementById('settings-stats-visited');
  statsVisitedSlider.value = appSettings.statsTopVisited ?? 10;
  document.getElementById('settings-stats-visited-value').textContent = appSettings.statsTopVisited ?? 10;

  const statsFoldersSlider = document.getElementById('settings-stats-folders');
  statsFoldersSlider.value = appSettings.statsTopFolders ?? 8;
  document.getElementById('settings-stats-folders-value').textContent = appSettings.statsTopFolders ?? 8;

  const statsDomainsSlider = document.getElementById('settings-stats-domains');
  statsDomainsSlider.value = appSettings.statsTopDomains ?? 8;
  document.getElementById('settings-stats-domains-value').textContent = appSettings.statsTopDomains ?? 8;

  // Shortcuts settings
  renderShortcutsSettings();
}

function renderCustomColors(theme, custom) {
  const container = document.getElementById('settings-custom-colors');
  container.innerHTML = '';

  for (const group of COLOR_GROUPS) {
    const section = document.createElement('div');
    section.className = 'settings-color-section';
    section.innerHTML = `<div class="settings-color-section-title">${t(group.labelKey)}</div>`;

    for (const key of group.keys) {
      const currentValue = custom[key] || theme.colors[key];
      const isCustom = key in custom;
      const row = document.createElement('div');
      row.className = 'settings-color-row';
      row.innerHTML = `
        <input type="color" class="settings-color-picker" value="${currentValue}" data-color-key="${key}">
        <span class="settings-color-name">${key}</span>
        <span class="settings-color-hex">${currentValue}</span>
        <button class="settings-color-reset${isCustom ? '' : ' hidden'}" data-color-key="${key}" title="${t('presets.resetTitle')}">✕</button>
      `;

      const picker = row.querySelector('.settings-color-picker');
      const hexLabel = row.querySelector('.settings-color-hex');
      const resetBtn = row.querySelector('.settings-color-reset');

      picker.addEventListener('input', (e) => {
        const val = e.target.value;
        if (!appSettings.customColors) appSettings.customColors = {};
        appSettings.customColors[key] = val;
        appSettings.savedPreset = { name: null, theme: appSettings.theme, accentColor: appSettings.accentColor, customColors: { ...appSettings.customColors } };
        hexLabel.textContent = val;
        resetBtn.classList.remove('hidden');
        applySettings();
        saveSettings();
      });

      resetBtn.addEventListener('click', () => {
        delete appSettings.customColors[key];
        picker.value = theme.colors[key];
        hexLabel.textContent = theme.colors[key];
        resetBtn.classList.add('hidden');
        if (Object.keys(appSettings.customColors).length === 0) {
          appSettings.savedPreset = null;
        } else {
          appSettings.savedPreset = { name: null, theme: appSettings.theme, accentColor: appSettings.accentColor, customColors: { ...appSettings.customColors } };
        }
        applySettings();
        saveSettings();
      });

      section.appendChild(row);
    }
    container.appendChild(section);
  }
}

function renderPresets() {
  const list = document.getElementById('settings-presets-list');
  const presets = appSettings.colorPresets || [];
  list.innerHTML = '';

  if (presets.length === 0) {
    list.innerHTML = `<div class="settings-presets-empty">${t('presets.empty')}</div>`;
    return;
  }

  for (let i = 0; i < presets.length; i++) {
    const preset = presets[i];
    const theme = THEMES[preset.theme] || THEMES.macchiato;
    const colors = { ...theme.colors, ...(preset.customColors || {}) };
    const item = document.createElement('div');
    item.className = 'settings-preset-item';
    item.innerHTML = `
      <div class="settings-preset-preview">
        <span style="background:${colors.base}"></span>
        <span style="background:${colors.surface0}"></span>
        <span style="background:${colors.surface1}"></span>
        <span style="background:${colors[preset.accentColor] || colors.mauve}"></span>
        <span style="background:${colors.text}"></span>
      </div>
      <span class="settings-preset-name">${escapeHtml(preset.name)}</span>
      <button class="settings-preset-delete" title="${t('presets.deleteTitle')}">✕</button>
    `;

    item.addEventListener('click', (e) => {
      if (e.target.closest('.settings-preset-delete')) return;
      appSettings.theme = preset.theme;
      appSettings.accentColor = preset.accentColor;
      appSettings.customColors = { ...(preset.customColors || {}) };
      appSettings.savedPreset = { name: preset.name, theme: preset.theme, accentColor: preset.accentColor, customColors: { ...(preset.customColors || {}) } };
      applySettings();
      saveSettings();
      renderSettingsUI();
    });

    item.querySelector('.settings-preset-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      appSettings.colorPresets.splice(i, 1);
      saveSettings();
      renderPresets();
    });

    list.appendChild(item);
  }
}

// Collapsible toggles
document.getElementById('settings-custom-colors-toggle').addEventListener('click', function() {
  this.classList.toggle('open');
  document.getElementById('settings-custom-colors').classList.toggle('hidden');
});

document.getElementById('settings-presets-toggle').addEventListener('click', function() {
  this.classList.toggle('open');
  document.getElementById('settings-presets').classList.toggle('hidden');
  if (this.classList.contains('open')) renderPresets();
});

// Save preset
document.getElementById('settings-preset-save-btn').addEventListener('click', () => {
  const nameInput = document.getElementById('settings-preset-name');
  const name = nameInput.value.trim();
  if (!name) return;
  if (!appSettings.colorPresets) appSettings.colorPresets = [];
  appSettings.colorPresets.push({
    name,
    theme: appSettings.theme,
    accentColor: appSettings.accentColor,
    customColors: { ...(appSettings.customColors || {}) }
  });
  nameInput.value = '';
  saveSettings();
  renderPresets();
});

// Settings slider/control event listeners
document.getElementById('settings-bg-opacity').addEventListener('input', (e) => {
  appSettings.bgOpacity = parseFloat(e.target.value);
  document.getElementById('settings-bg-opacity-value').textContent = appSettings.bgOpacity;
  applySettings();
  saveSettings();
});

document.getElementById('settings-content-width').addEventListener('input', (e) => {
  appSettings.contentMaxWidth = parseInt(e.target.value);
  document.getElementById('settings-width-value').textContent = appSettings.contentMaxWidth + 'px';
  applySettings();
  saveSettings();
});

document.getElementById('settings-search-font').addEventListener('input', (e) => {
  appSettings.searchFontSize = parseInt(e.target.value);
  document.getElementById('settings-font-value').textContent = appSettings.searchFontSize + 'px';
  applySettings();
  saveSettings();
});

document.querySelectorAll('.settings-density-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    appSettings.density = btn.dataset.density;
    applySettings();
    saveSettings();
    document.querySelectorAll('.settings-density-btn').forEach(b => b.classList.toggle('active', b.dataset.density === appSettings.density));
  });
});

document.getElementById('settings-show-visits').addEventListener('change', (e) => {
  appSettings.showVisitCount = e.target.checked;
  applySettings();
  saveSettings();
});

// Navigation settings listeners
document.getElementById('settings-double-click').addEventListener('change', async (e) => {
  appSettings.doubleClickToOpen = e.target.checked;
  saveSettings();
  await renderBookmarksTree();
  await renderPinnedBar();
});

document.getElementById('settings-middle-click').addEventListener('change', (e) => {
  appSettings.middleClickNewTab = e.target.checked;
  saveSettings();
});

document.querySelectorAll('.settings-folder-state-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    appSettings.folderStartState = btn.dataset.folderState;
    saveSettings();
    document.querySelectorAll('.settings-folder-state-btn').forEach(b => b.classList.toggle('active', b.dataset.folderState === appSettings.folderStartState));
  });
});

// Default folder states
const ROOT_FOLDER_KEYS = {
  'toolbar_____': 'folder.toolbar',
  'menu________': 'folder.menu',
  'unfiled_____': 'folder.unfiled',
  'mobile______': 'folder.mobile'
};

function getRootFolderName(id) {
  const key = ROOT_FOLDER_KEYS[id];
  return key ? t(key) : null;
}

function renderDefaultFolderStates() {
  const container = document.getElementById('settings-default-folder-states');
  container.innerHTML = '';
  const defaults = appSettings.defaultFolderStates || {};

  // Get all root-level folders from the rendered tree
  const rootFolders = bookmarksTree.querySelectorAll(':scope > .folder');

  rootFolders.forEach(folder => {
    const folderId = folder.dataset.folderId;
    const folderName = getRootFolderName(folderId) || folder.dataset.name || folderId;
    const isExpanded = defaults[folderId] === true;

    const label = document.createElement('label');
    label.className = 'settings-label settings-toggle-label';
    label.innerHTML = `
      <span>${escapeHtml(folderName)}</span>
      <input type="checkbox" ${isExpanded ? 'checked' : ''}>
      <span class="settings-toggle"></span>
    `;

    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
      if (!appSettings.defaultFolderStates) appSettings.defaultFolderStates = {};
      appSettings.defaultFolderStates[folderId] = checkbox.checked;
      saveSettings();
    });

    container.appendChild(label);
  });
}

// Warning settings listeners
document.getElementById('settings-warn-duplicate').addEventListener('change', (e) => {
  appSettings.warnDuplicateUrl = e.target.checked;
  saveSettings();
});

document.getElementById('settings-open-all-threshold').addEventListener('input', (e) => {
  appSettings.openAllThreshold = parseInt(e.target.value);
  document.getElementById('settings-open-all-threshold-value').textContent = appSettings.openAllThreshold === 0 ? t('settings.navigation.openAllDisabled') : appSettings.openAllThreshold;
  saveSettings();
});

// Search settings listeners
document.getElementById('settings-search-debounce').addEventListener('input', (e) => {
  appSettings.searchDebounce = parseInt(e.target.value);
  document.getElementById('settings-debounce-value').textContent = appSettings.searchDebounce + 'ms';
  saveSettings();
});

document.querySelectorAll('.settings-search-scope-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    appSettings.searchScope = btn.dataset.scope;
    saveSettings();
    document.querySelectorAll('.settings-search-scope-btn').forEach(b => b.classList.toggle('active', b.dataset.scope === appSettings.searchScope));
    // Re-filter if currently searching
    if (currentQuery) filterTree(currentQuery);
  });
});

document.getElementById('settings-search-placeholder').addEventListener('input', (e) => {
  appSettings.searchPlaceholder = e.target.value;
  applySettings();
  saveSettings();
});

// Pinned settings listeners
document.getElementById('settings-pinned-limit').addEventListener('input', (e) => {
  appSettings.pinnedLimit = parseInt(e.target.value);
  document.getElementById('settings-pinned-limit-value').textContent = appSettings.pinnedLimit;
  saveSettings();
});

document.getElementById('settings-pinned-show-empty').addEventListener('change', (e) => {
  appSettings.pinnedShowEmpty = e.target.checked;
  applySettings();
  saveSettings();
});

document.querySelectorAll('.settings-pinned-size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    appSettings.pinnedIconSize = btn.dataset.pinnedSize;
    applySettings();
    saveSettings();
    document.querySelectorAll('.settings-pinned-size-btn').forEach(b => b.classList.toggle('active', b.dataset.pinnedSize === appSettings.pinnedIconSize));
  });
});

// Stats settings listeners
document.getElementById('settings-stats-visited').addEventListener('input', (e) => {
  appSettings.statsTopVisited = parseInt(e.target.value);
  document.getElementById('settings-stats-visited-value').textContent = appSettings.statsTopVisited;
  saveSettings();
});

document.getElementById('settings-stats-folders').addEventListener('input', (e) => {
  appSettings.statsTopFolders = parseInt(e.target.value);
  document.getElementById('settings-stats-folders-value').textContent = appSettings.statsTopFolders;
  saveSettings();
});

document.getElementById('settings-stats-domains').addEventListener('input', (e) => {
  appSettings.statsTopDomains = parseInt(e.target.value);
  document.getElementById('settings-stats-domains-value').textContent = appSettings.statsTopDomains;
  saveSettings();
});

// Button visibility listeners
['help', 'stats', 'add', 'bg'].forEach(id => {
  const key = `show${id.charAt(0).toUpperCase() + id.slice(1)}Button`;
  document.getElementById(`settings-show-${id}-btn`).addEventListener('change', (e) => {
    appSettings[key] = e.target.checked;
    applySettings();
    saveSettings();
  });
});

// Buttons order
const BUTTON_LABEL_KEYS = {
  'help': 'button.help',
  'stats': 'button.stats',
  'add': 'button.add',
  'settings': 'button.settings',
  'bg': 'button.bg'
};

function getButtonLabel(id) {
  const key = BUTTON_LABEL_KEYS[id];
  return key ? t(key) : id;
}

function renderButtonsOrder() {
  const container = document.getElementById('settings-buttons-order');
  const order = appSettings.buttonsOrder || ['help', 'stats', 'add', 'settings', 'bg'];
  container.innerHTML = '';

  order.forEach((id, i) => {
    const item = document.createElement('div');
    item.className = 'settings-order-item';
    item.draggable = true;
    item.dataset.index = i;
    item.innerHTML = `<span class="settings-order-handle">⠿</span>${getButtonLabel(id)}`;

    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(i));
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      container.querySelectorAll('.settings-order-item').forEach(el => el.classList.remove('drag-over-left', 'drag-over-right'));
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const rect = item.getBoundingClientRect();
      const left = e.clientX < rect.left + rect.width / 2;
      item.classList.toggle('drag-over-left', left);
      item.classList.toggle('drag-over-right', !left);
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over-left', 'drag-over-right');
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      let toIndex = i;
      const rect = item.getBoundingClientRect();
      const left = e.clientX < rect.left + rect.width / 2;
      const arr = [...order];
      const [moved] = arr.splice(fromIndex, 1);
      if (fromIndex < toIndex) toIndex--;
      if (!left) toIndex++;
      arr.splice(toIndex, 0, moved);
      appSettings.buttonsOrder = arr;
      applySettings();
      saveSettings();
      renderButtonsOrder();
    });

    container.appendChild(item);
  });
}

// Buttons position listener
document.querySelectorAll('.settings-position-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    appSettings.buttonsPosition = btn.dataset.position;
    applySettings();
    saveSettings();
    document.querySelectorAll('.settings-position-btn').forEach(b => b.classList.toggle('active', b.dataset.position === appSettings.buttonsPosition));
  });
});

// ==================== DATA MANAGEMENT ====================

// Serialize bookmark tree to Netscape Bookmark HTML
function bookmarksToHtml(nodes, indent = '    ') {
  let html = '';
  for (const node of nodes) {
    if (node.children) {
      html += `${indent}<DT><H3>${escapeHtml(node.title)}</H3>\n`;
      html += `${indent}<DL><p>\n`;
      html += bookmarksToHtml(node.children, indent + '    ');
      html += `${indent}</DL><p>\n`;
    } else if (node.url) {
      html += `${indent}<DT><A HREF="${escapeHtml(node.url)}">${escapeHtml(node.title || node.url)}</A>\n`;
    }
  }
  return html;
}

// Parse Netscape Bookmark HTML into tree
function parseBookmarksHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  function parseDL(dl) {
    const items = [];
    if (!dl) return items;
    for (const dt of dl.children) {
      if (dt.tagName !== 'DT') continue;
      const a = dt.querySelector(':scope > A');
      const h3 = dt.querySelector(':scope > H3');
      if (a) {
        items.push({ title: a.textContent, url: a.getAttribute('href') });
      } else if (h3) {
        const subDl = dt.querySelector(':scope > DL');
        items.push({ title: h3.textContent, children: parseDL(subDl) });
      }
    }
    return items;
  }

  const rootDl = doc.querySelector('DL');
  return parseDL(rootDl);
}

// Import bookmark tree recursively
async function importBookmarkTree(items, parentId) {
  for (const item of items) {
    if (item.children) {
      const folder = await browser.bookmarks.create({ title: item.title, parentId });
      await importBookmarkTree(item.children, folder.id);
    } else if (item.url) {
      await browser.bookmarks.create({ title: item.title, url: item.url, parentId });
    }
  }
}

// Export bookmarks
document.getElementById('settings-export-bookmarks').addEventListener('click', async () => {
  const tree = await browser.bookmarks.getTree();
  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file. -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;
  html += bookmarksToHtml(tree[0].children || []);
  html += '</DL><p>\n';
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookmarks-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
});

// Import bookmarks
const importBookmarksInput = document.getElementById('settings-import-bookmarks-input');
document.getElementById('settings-import-bookmarks').addEventListener('click', () => importBookmarksInput.click());
importBookmarksInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const items = parseBookmarksHtml(text);
    if (items.length === 0) {
      alert(t('alert.importNoBookmarks'));
      return;
    }
    if (!confirm(t('confirm.importBookmarks'))) return;
    const tree = await browser.bookmarks.getTree();
    const root = tree[0].children || [];
    const unfiled = root.find(n => n.id === 'unfiled_____') || root[root.length - 1];
    const folder = await browser.bookmarks.create({ title: 'Import ' + new Date().toISOString().slice(0, 10), parentId: unfiled.id });
    await importBookmarkTree(items, folder.id);
    await renderBookmarksTree();
  } catch (err) {
    alert(t('alert.importBookmarksError', { message: err.message }));
  }
  importBookmarksInput.value = '';
});

// Export settings
document.getElementById('settings-export').addEventListener('click', async () => {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    appSettings,
    clickCounts,
    folderStates,
    pinnedBookmarks
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `newtab-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// Import
const importInput = document.getElementById('settings-import-input');
document.getElementById('settings-import').addEventListener('click', () => importInput.click());
importInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data.version || !data.appSettings) {
      alert(t('alert.importInvalid'));
      return;
    }
    if (data.appSettings) {
      appSettings = { ...DEFAULT_SETTINGS, ...data.appSettings };
      await saveSettings();
    }
    if (data.clickCounts) {
      clickCounts = data.clickCounts;
      await saveClickCounts();
    }
    if (data.folderStates) {
      folderStates = data.folderStates;
      await saveFolderStates();
    }
    if (data.pinnedBookmarks) {
      pinnedBookmarks = data.pinnedBookmarks;
      await savePinnedBookmarks();
    }
    currentLang = appSettings.language || 'en';
    document.documentElement.lang = currentLang;
    applyI18nToDom();
    applySettings();
    renderSettingsUI();
    updateShortcutDisplays();
    await renderBookmarksTree();
    await renderPinnedBar();
  } catch (err) {
    alert(t('alert.importError', { message: err.message }));
  }
  importInput.value = '';
});

// Reset visit counters
document.getElementById('settings-reset-visits').addEventListener('click', async () => {
  if (!confirm(t('confirm.resetVisits'))) return;
  clickCounts = {};
  await saveClickCounts();
  await renderBookmarksTree();
});

// Reset folder states
document.getElementById('settings-reset-folders').addEventListener('click', async () => {
  if (!confirm(t('confirm.resetFolders'))) return;
  folderStates = {};
  await saveFolderStates();
  await renderBookmarksTree();
});

// Reset pinned bookmarks
document.getElementById('settings-reset-pinned').addEventListener('click', async () => {
  if (!confirm(t('confirm.resetPinned'))) return;
  pinnedBookmarks = [];
  selectedPinnedIndex = -1;
  await savePinnedBookmarks();
  await renderPinnedBar();
});

// ==================== SHORTCUT SETTINGS ====================

let recordingShortcutId = null;
let recordingElement = null;

function renderShortcutsSettings() {
  const container = document.getElementById('settings-shortcuts-container');
  const sc = getShortcuts();
  const userOverrides = appSettings.shortcuts || {};
  let html = '';

  for (const cat of SHORTCUT_CATEGORIES) {
    html += `<div class="settings-shortcuts-category">
      <div class="settings-shortcuts-category-title">${t(cat.titleKey)}</div>`;
    for (const s of cat.shortcuts) {
      const def = sc[s.id];
      const isCustom = s.id in userOverrides;
      html += `<div class="settings-shortcut-row" data-shortcut-id="${s.id}">
        <span class="settings-shortcut-label">${t(s.labelKey)}</span>
        <button class="settings-shortcut-key${isCustom ? ' custom' : ''}" data-shortcut-id="${s.id}">${formatShortcut(def)}</button>
        <button class="settings-shortcut-reset${isCustom ? '' : ' hidden'}" data-shortcut-id="${s.id}" title="${t('settings.shortcuts.resetOne')}">↺</button>
      </div>`;
    }
    html += '</div>';
  }

  html += `<div class="settings-shortcuts-actions">
    <button class="btn btn-secondary" id="settings-shortcuts-reset-all">${t('settings.shortcuts.resetAll')}</button>
  </div>`;

  container.innerHTML = html;

  // Attach listeners to key buttons
  container.querySelectorAll('.settings-shortcut-key').forEach(btn => {
    btn.addEventListener('click', () => startShortcutRecording(btn.dataset.shortcutId, btn));
  });

  // Attach listeners to reset buttons
  container.querySelectorAll('.settings-shortcut-reset').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.shortcutId;
      delete appSettings.shortcuts[id];
      saveSettings();
      renderShortcutsSettings();
      updateShortcutDisplays();
    });
  });

  // Reset all button
  document.getElementById('settings-shortcuts-reset-all').addEventListener('click', () => {
    appSettings.shortcuts = {};
    saveSettings();
    renderShortcutsSettings();
    updateShortcutDisplays();
  });
}

function startShortcutRecording(shortcutId, element) {
  // Cancel any previous recording
  if (recordingElement) {
    stopShortcutRecording(false);
  }

  recordingShortcutId = shortcutId;
  recordingElement = element;
  element.classList.add('recording');
  element.textContent = t('settings.shortcuts.recording');

  // Use capture phase to intercept before any other handler
  document.addEventListener('keydown', handleShortcutRecording, true);
  document.addEventListener('click', handleRecordingCancel, true);
}

function handleShortcutRecording(e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  // Ignore lone modifier keys
  if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;

  // Escape cancels recording
  if (e.key === 'Escape' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
    stopShortcutRecording(false);
    return;
  }

  const newDef = {
    key: e.key.length === 1 ? e.key.toLowerCase() : e.key,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey
  };

  // Check for conflicts
  const sc = getShortcuts();
  const conflicts = [];
  for (const [id, def] of Object.entries(sc)) {
    if (id === recordingShortcutId) continue;
    if (def.key === newDef.key && def.ctrl === newDef.ctrl && def.alt === newDef.alt && def.shift === newDef.shift) {
      // Find the label for this conflicting shortcut
      for (const cat of SHORTCUT_CATEGORIES) {
        const found = cat.shortcuts.find(s => s.id === id);
        if (found) {
          conflicts.push(t(found.labelKey));
          break;
        }
      }
    }
  }

  if (conflicts.length > 0) {
    recordingElement.classList.add('conflict');
    recordingElement.textContent = t('settings.shortcuts.conflict', { label: conflicts[0] });
    setTimeout(() => {
      if (recordingElement) {
        recordingElement.classList.remove('conflict');
        recordingElement.textContent = t('settings.shortcuts.recording');
      }
    }, 1500);
    return;
  }

  // Check if same as default — if so, remove override
  const defaultDef = DEFAULT_SHORTCUTS[recordingShortcutId];
  if (defaultDef && newDef.key === defaultDef.key && newDef.ctrl === defaultDef.ctrl && newDef.alt === defaultDef.alt && newDef.shift === defaultDef.shift) {
    delete appSettings.shortcuts[recordingShortcutId];
  } else {
    if (!appSettings.shortcuts) appSettings.shortcuts = {};
    appSettings.shortcuts[recordingShortcutId] = newDef;
  }

  saveSettings();
  stopShortcutRecording(true);
  renderShortcutsSettings();
  updateShortcutDisplays();
}

function handleRecordingCancel(e) {
  // Cancel if clicking outside the recording element
  if (recordingElement && !recordingElement.contains(e.target)) {
    e.stopImmediatePropagation();
    stopShortcutRecording(false);
  }
}

function stopShortcutRecording(success) {
  document.removeEventListener('keydown', handleShortcutRecording, true);
  document.removeEventListener('click', handleRecordingCancel, true);
  if (recordingElement) {
    recordingElement.classList.remove('recording', 'conflict');
    if (!success) {
      const sc = getShortcuts();
      recordingElement.textContent = formatShortcut(sc[recordingShortcutId]);
    }
  }
  recordingShortcutId = null;
  recordingElement = null;
}

function updateShortcutDisplays() {
  const sc = getShortcuts();

  // Update context menu shortcut spans
  const contextMappings = {
    'open-new-tab': 'open-in-new-tab',
    'new-bookmark': 'new-bookmark',
    'new-folder': 'new-folder',
    'open-all': 'open-all-in-folder',
    'pin': 'pin-bookmark',
    'edit': 'edit-selected',
    'move': 'move-selected',
    'delete': 'delete-selected'
  };

  contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
    const action = item.dataset.action;
    const shortcutId = contextMappings[action];
    if (shortcutId && sc[shortcutId]) {
      const span = item.querySelector('.shortcut');
      if (span) span.textContent = formatShortcut(sc[shortcutId]);
    }
  });

  // Update add menu shortcut spans
  addMenu.querySelectorAll('.add-menu-item').forEach(item => {
    const action = item.dataset.action;
    const shortcutId = action === 'new-bookmark' ? 'new-bookmark' : action === 'new-folder' ? 'new-folder' : null;
    if (shortcutId && sc[shortcutId]) {
      const span = item.querySelector('.shortcut');
      if (span) span.textContent = formatShortcut(sc[shortcutId]);
    }
  });

  // Update button titles
  helpButton.title = t('btn.help.title', { shortcut: formatShortcut(sc['show-help']) });
  settingsButton.title = t('btn.settings.title', { shortcut: formatShortcut(sc['show-settings']) });
  statsButton.title = t('btn.stats.title', { shortcut: formatShortcut(sc['show-stats']) });
}

function showSettings() {
  renderSettingsUI();
  showModal(settingsModal);
}

// Settings button handler
settingsButton.addEventListener('click', showSettings);
settingsModal.querySelector('[data-action="cancel"]').addEventListener('click', hideModal);

// Language selector listener
document.getElementById('settings-language-select').addEventListener('change', (e) => {
  switchLanguage(e.target.value);
});

// Settings category navigation
settingsModal.querySelectorAll('.settings-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const category = item.dataset.category;
    settingsModal.querySelectorAll('.settings-nav-item').forEach(n => n.classList.remove('active'));
    settingsModal.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    settingsModal.querySelector(`.settings-panel[data-panel="${category}"]`).classList.add('active');
  });
});

// Initialize on load
init();
