// ==================== INTERNATIONALIZATION ====================

let currentLang = 'en';

const TRANSLATIONS = {
  en: {
    // === HTML static elements ===

    // Floating buttons
    'btn.help.title': 'Keyboard shortcuts ({shortcut})',
    'btn.stats.title': 'Statistics ({shortcut})',
    'btn.add.title': 'Add new item',
    'btn.settings.title': 'Settings ({shortcut})',
    'btn.bg.title': 'Set background image',

    // Add menu
    'add.bookmark': 'New bookmark',
    'add.bookmark.shortcut': 'Ctrl+Alt+N',
    'add.folder': 'New folder',
    'add.folder.shortcut': 'Ctrl+Alt+M',

    // Context menu
    'ctx.openNewTab': 'Open in new tab',
    'ctx.newBookmark': 'New bookmark here',
    'ctx.newFolder': 'New folder here',
    'ctx.openAll': 'Open all',
    'ctx.pin': 'Pin',
    'ctx.unpin': 'Unpin',
    'ctx.edit': 'Edit',
    'ctx.move': 'Move',
    'ctx.delete': 'Delete',

    // Delete modal
    'modal.delete.headerBookmark': 'Delete bookmark',
    'modal.delete.headerFolder': 'Delete folder',
    'modal.delete.bodyBookmark': 'Are you sure you want to delete this bookmark:',
    'modal.delete.bodyFolder': 'Are you sure you want to delete this folder:',
    'modal.delete.warning': 'This folder contains bookmarks — all of them will be deleted!',
    'modal.delete.cancel': 'Cancel (Esc)',
    'modal.delete.confirm': 'Delete (Enter)',
    'modal.delete.itemBookmark': 'bookmark',
    'modal.delete.itemFolder': 'folder',

    // Edit modal
    'modal.edit.headerBookmark': 'Edit bookmark',
    'modal.edit.headerFolder': 'Edit folder',
    'modal.edit.title': 'Title',
    'modal.edit.url': 'URL',
    'modal.edit.cancel': 'Cancel (Esc)',
    'modal.edit.confirm': 'Save (Enter)',
    'modal.edit.itemBookmark': 'bookmark',
    'modal.edit.itemFolder': 'folder',

    // Move modal
    'modal.move.header': 'Move bookmark',
    'modal.move.subtitle': 'Enter: inside/after | Ctrl+Enter: below | Ctrl+Shift+Enter: above',
    'modal.move.cancel': 'Cancel (Esc)',
    'modal.move.confirm': 'Move (Enter)',

    // New bookmark modal
    'modal.newBookmark.header': 'New bookmark',
    'modal.newBookmark.title': 'Title',
    'modal.newBookmark.titlePlaceholder': 'Bookmark name',
    'modal.newBookmark.url': 'URL',
    'modal.newBookmark.urlPlaceholder': 'https://...',
    'modal.newBookmark.subtitle': 'Navigation: Ctrl+arrows',
    'modal.newBookmark.cancel': 'Cancel (Esc)',
    'modal.newBookmark.confirm': 'Create (Enter)',

    // New folder modal
    'modal.newFolder.header': 'New folder',
    'modal.newFolder.name': 'Folder name',
    'modal.newFolder.namePlaceholder': 'Folder name',
    'modal.newFolder.subtitle': 'Navigation: Ctrl+arrows',
    'modal.newFolder.cancel': 'Cancel (Esc)',
    'modal.newFolder.confirm': 'Create (Enter)',

    // Duplicate modal
    'modal.duplicate.header': 'Bookmark already exists',
    'modal.duplicate.body': 'This bookmark already exists in the following locations:',
    'modal.duplicate.cancel': 'Cancel (Esc)',
    'modal.duplicate.confirm': 'Add anyway (Enter)',

    // Stats modal
    'modal.stats.header': 'Bookmark statistics',
    'modal.stats.bookmarks': 'Bookmarks',
    'modal.stats.folders': 'Folders',
    'modal.stats.domains': 'Domains',
    'modal.stats.visits': 'Visits',
    'modal.stats.topVisited': 'Most visited',
    'modal.stats.foldersChart': 'Pages per folder distribution',
    'modal.stats.domainsChart': 'Bookmarks per domain',
    'modal.stats.close': 'Close (Esc)',
    'modal.stats.visitCount': '{count} visits',
    'modal.stats.noVisits': 'No visit data',

    // Help modal
    'modal.help.header': 'Keyboard shortcuts',
    'modal.help.close': 'Close (Esc)',
    'modal.help.modals': 'In modals',
    'modal.help.closeModal': 'Close modal',
    'modal.help.confirmAction': 'Confirm action',
    'modal.help.folderNav': 'Navigate folders',
    'modal.help.folderNavInput': 'Navigation (when focused in input)',
    'modal.help.moveAfter': 'Move after',
    'modal.help.moveBefore': 'Move before',

    // Settings modal
    'settings.header': 'Settings',
    'settings.support': 'Support FuzzyMarks',
    'settings.close': 'Close (Esc)',

    // Settings nav
    'settings.nav.appearance': 'Appearance',
    'settings.nav.navigation': 'Navigation',
    'settings.nav.shortcuts': 'Shortcuts',
    'settings.nav.search': 'Search',
    'settings.nav.pinned': 'Pinned',
    'settings.nav.ui': 'Interface',
    'settings.nav.data': 'Data',

    // Settings: Appearance panel
    'settings.appearance.header': 'Appearance',
    'settings.appearance.language': 'Language',
    'settings.appearance.theme': 'Theme',
    'settings.appearance.accentColor': 'Accent color',
    'settings.appearance.customColors': 'Customize colors',
    'settings.appearance.presets': 'Color presets',
    'settings.appearance.presetPlaceholder': 'Preset name...',
    'settings.appearance.presetSave': 'Save',
    'settings.appearance.bgOpacity': 'Background opacity',
    'settings.appearance.density': 'Display density',
    'settings.appearance.compact': 'Compact',
    'settings.appearance.normal': 'Normal',
    'settings.appearance.spacious': 'Spacious',
    'settings.appearance.contentWidth': 'Content width',
    'settings.appearance.searchFontSize': 'Search font size',
    'settings.appearance.showVisits': 'Show visit counter',

    // Settings: Navigation panel
    'settings.navigation.header': 'Navigation and behavior',
    'settings.navigation.doubleClick': 'Double click opens bookmark',
    'settings.navigation.middleClick': 'Middle mouse button — new tab',
    'settings.navigation.folderState': 'Folder state on startup',
    'settings.navigation.remembered': 'Remembered',
    'settings.navigation.collapsed': 'Collapsed',
    'settings.navigation.expanded': 'Expanded',
    'settings.navigation.defaultFolderStates': 'Default root folder states',
    'settings.navigation.warnDuplicate': 'Duplicate URL warning',
    'settings.navigation.openAllThreshold': 'Open all confirmation threshold',
    'settings.navigation.openAllDisabled': 'disabled',
    'settings.navigation.openAllHint': '0 = no confirmation',

    // Settings: Shortcuts panel
    'settings.shortcuts.header': 'Keyboard shortcuts',
    'settings.shortcuts.resetAll': 'Reset all to defaults',
    'settings.shortcuts.resetOne': 'Reset to default',
    'settings.shortcuts.recording': 'Press shortcut...',
    'settings.shortcuts.conflict': 'Conflict: {label}',

    // Settings: Search panel
    'settings.search.header': 'Search',
    'settings.search.debounce': 'Search delay',
    'settings.search.scope': 'Search scope',
    'settings.search.scopeBoth': 'Title + URL',
    'settings.search.scopeTitle': 'Title only',
    'settings.search.scopeUrl': 'URL only',
    'settings.search.placeholder': 'Placeholder',
    'settings.search.placeholderPlaceholder': 'Text in search field',
    'search.defaultPlaceholder': 'Search bookmarks...',

    // Settings: Pinned panel
    'settings.pinned.header': 'Pinned bookmarks',
    'settings.pinned.limit': 'Pinned limit',
    'settings.pinned.showEmpty': 'Show bar when no pinned',
    'settings.pinned.iconSize': 'Icon size',
    'settings.pinned.small': 'Small',
    'settings.pinned.normal': 'Normal',
    'settings.pinned.large': 'Large',

    // Settings: UI panel
    'settings.ui.header': 'Interface elements',
    'settings.ui.buttonVisibility': 'Button visibility',
    'settings.ui.btnHelp': 'Help (?)',
    'settings.ui.btnStats': 'Statistics',
    'settings.ui.btnAdd': 'Add',
    'settings.ui.btnBg': 'Background',
    'settings.ui.buttonPosition': 'Button position',
    'settings.ui.buttonOrder': 'Button order',
    'settings.ui.statsVisited': 'Statistics — "Top visited" limit',
    'settings.ui.statsFolders': 'Statistics — "Top folders" limit',
    'settings.ui.statsDomains': 'Statistics — "Top domains" limit',

    // Settings: Data panel
    'settings.data.header': 'Data',
    'settings.data.bookmarks': 'Bookmarks',
    'settings.data.exportBookmarks': 'Export bookmarks',
    'settings.data.importBookmarks': 'Import bookmarks',
    'settings.data.settingsBackup': 'Settings backup',
    'settings.data.exportSettings': 'Export settings',
    'settings.data.importSettings': 'Import settings',
    'settings.data.resetData': 'Reset data',
    'settings.data.resetVisits': 'Reset visit counters',
    'settings.data.resetFolders': 'Reset folder states',
    'settings.data.resetPinned': 'Reset pinned bookmarks',

    // === JS dynamic strings ===

    // Theme labels
    'theme.light': 'Light',
    'theme.medium': 'Medium',
    'theme.dark': 'Dark',
    'theme.darkest': 'Darkest',

    // Color group labels
    'colors.background': 'Background',
    'colors.surfaces': 'Surfaces',
    'colors.overlays': 'Overlays',
    'colors.text': 'Text',

    // Shortcut categories
    'shortcuts.cat.navigation': 'Navigation',
    'shortcuts.cat.management': 'Bookmark/folder management',
    'shortcuts.cat.tools': 'View and tools',
    'shortcuts.cat.pinned': 'Pinned bookmarks',

    // Shortcut labels
    'shortcut.navUp': 'Navigate up',
    'shortcut.navDown': 'Navigate down',
    'shortcut.collapseFolder': 'Collapse folder',
    'shortcut.expandFolder': 'Expand folder',
    'shortcut.openOrToggle': 'Open bookmark/folder',
    'shortcut.openInNewTab': 'Open in new tab',
    'shortcut.jumpUp5': 'Jump 5 up',
    'shortcut.jumpDown5': 'Jump 5 down',
    'shortcut.goToStart': 'Beginning of list',
    'shortcut.goToEnd': 'End of list',
    'shortcut.newBookmark': 'New bookmark',
    'shortcut.newFolder': 'New folder',
    'shortcut.editSelected': 'Edit item',
    'shortcut.moveSelected': 'Move to folder',
    'shortcut.moveUp': 'Reorder up',
    'shortcut.moveDown': 'Reorder down',
    'shortcut.deleteSelected': 'Delete item',
    'shortcut.undo': 'Undo action',
    'shortcut.pinBookmark': 'Pin bookmark',
    'shortcut.focusSearch': 'Focus on search',
    'shortcut.clearSearch': 'Clear search',
    'shortcut.toggleExpandAll': 'Expand/collapse folders',
    'shortcut.openAllInFolder': 'Open all from folder',
    'shortcut.showStats': 'Statistics',
    'shortcut.showHelp': 'Help',
    'shortcut.showSettings': 'Settings',
    'shortcut.pinnedNavLeft': 'Navigate left',
    'shortcut.pinnedNavRight': 'Navigate right',
    'shortcut.pinnedOpen': 'Open',
    'shortcut.pinnedOpenNewTab': 'Open in new tab',
    'shortcut.pinnedReorderLeft': 'Reorder left',
    'shortcut.pinnedReorderRight': 'Reorder right',
    'shortcut.unpinBookmark': 'Unpin bookmark',
    'shortcut.exitPinnedMode': 'Exit mode',

    // Button labels (order)
    'button.help': 'Help (?)',
    'button.stats': 'Statistics',
    'button.add': 'Add',
    'button.settings': 'Settings',
    'button.bg': 'Background',

    // Root folder names
    'folder.toolbar': 'Bookmarks Toolbar',
    'folder.menu': 'Bookmarks Menu',
    'folder.unfiled': 'Other Bookmarks',
    'folder.mobile': 'Mobile Bookmarks',

    // Confirm/alert dialogs
    'confirm.openAll': 'Open {count} bookmarks in new tabs?',
    'confirm.resetVisits': 'Are you sure you want to reset all visit counters?',
    'confirm.resetFolders': 'Are you sure you want to reset folder states?',
    'confirm.resetPinned': 'Are you sure you want to unpin all pinned bookmarks?',
    'confirm.importBookmarks': 'Bookmarks found. They will be added to the "Import" folder. Continue?',
    'alert.importNoBookmarks': 'No bookmarks found in file.',
    'alert.importInvalid': 'Invalid backup file.',
    'alert.importError': 'Import error: {message}',
    'alert.importBookmarksError': 'Bookmark import error: {message}',

    // Stats
    'stats.visitCount': '{count} visits',
    'stats.noVisits': 'No visit data',
    'stats.rootFolder': 'Root',

    // Visit count in tree
    'tree.visits': '{count} visit',
    'tree.visitsPlural': '{count} visits',

    // Presets
    'presets.empty': 'No saved presets',
    'presets.custom': 'Custom',
    'presets.preset': 'Preset',
    'presets.deleteTitle': 'Delete preset',
    'presets.resetTitle': 'Reset to theme',

    // Duplicate
    'duplicate.rootFolder': 'Root folder',

    // Error
    'error.loadBookmarks': 'Failed to load bookmarks',

    // Position titles
    'position.topLeft': 'Top left',
    'position.topRight': 'Top right',
    'position.bottomLeft': 'Bottom left',
    'position.bottomRight': 'Bottom right',
  },

  pl: {
    // === HTML static elements ===

    // Floating buttons
    'btn.help.title': 'Skróty klawiszowe ({shortcut})',
    'btn.stats.title': 'Statystyki ({shortcut})',
    'btn.add.title': 'Dodaj nowy element',
    'btn.settings.title': 'Ustawienia ({shortcut})',
    'btn.bg.title': 'Ustaw tło',

    // Add menu
    'add.bookmark': 'Nowa zakładka',
    'add.bookmark.shortcut': 'Ctrl+Alt+N',
    'add.folder': 'Nowy folder',
    'add.folder.shortcut': 'Ctrl+Alt+M',

    // Context menu
    'ctx.openNewTab': 'Otwórz w nowej karcie',
    'ctx.newBookmark': 'Nowa zakładka tutaj',
    'ctx.newFolder': 'Nowy folder tutaj',
    'ctx.openAll': 'Otwórz wszystkie',
    'ctx.pin': 'Przypnij',
    'ctx.unpin': 'Odepnij',
    'ctx.edit': 'Edytuj',
    'ctx.move': 'Przenieś',
    'ctx.delete': 'Usuń',

    // Delete modal
    'modal.delete.headerBookmark': 'Usuń zakładkę',
    'modal.delete.headerFolder': 'Usuń folder',
    'modal.delete.bodyBookmark': 'Czy na pewno chcesz usunąć zakładkę:',
    'modal.delete.bodyFolder': 'Czy na pewno chcesz usunąć folder:',
    'modal.delete.warning': 'Ten folder zawiera zakładki - wszystkie zostaną usunięte!',
    'modal.delete.cancel': 'Anuluj (Esc)',
    'modal.delete.confirm': 'Usuń (Enter)',
    'modal.delete.itemBookmark': 'zakładkę',
    'modal.delete.itemFolder': 'folder',

    // Edit modal
    'modal.edit.headerBookmark': 'Edytuj zakładkę',
    'modal.edit.headerFolder': 'Edytuj folder',
    'modal.edit.title': 'Tytuł',
    'modal.edit.url': 'URL',
    'modal.edit.cancel': 'Anuluj (Esc)',
    'modal.edit.confirm': 'Zapisz (Enter)',
    'modal.edit.itemBookmark': 'zakładkę',
    'modal.edit.itemFolder': 'folder',

    // Move modal
    'modal.move.header': 'Przenieś zakładkę',
    'modal.move.subtitle': 'Enter: do środka/za | Ctrl+Enter: pod | Ctrl+Shift+Enter: nad',
    'modal.move.cancel': 'Anuluj (Esc)',
    'modal.move.confirm': 'Przenieś (Enter)',

    // New bookmark modal
    'modal.newBookmark.header': 'Nowa zakładka',
    'modal.newBookmark.title': 'Tytuł',
    'modal.newBookmark.titlePlaceholder': 'Nazwa zakładki',
    'modal.newBookmark.url': 'URL',
    'modal.newBookmark.urlPlaceholder': 'https://...',
    'modal.newBookmark.subtitle': 'Nawigacja: Ctrl+strzałki',
    'modal.newBookmark.cancel': 'Anuluj (Esc)',
    'modal.newBookmark.confirm': 'Utwórz (Enter)',

    // New folder modal
    'modal.newFolder.header': 'Nowy folder',
    'modal.newFolder.name': 'Nazwa folderu',
    'modal.newFolder.namePlaceholder': 'Nazwa folderu',
    'modal.newFolder.subtitle': 'Nawigacja: Ctrl+strzałki',
    'modal.newFolder.cancel': 'Anuluj (Esc)',
    'modal.newFolder.confirm': 'Utwórz (Enter)',

    // Duplicate modal
    'modal.duplicate.header': 'Zakładka już istnieje',
    'modal.duplicate.body': 'Ta zakładka już istnieje w następujących miejscach:',
    'modal.duplicate.cancel': 'Anuluj (Esc)',
    'modal.duplicate.confirm': 'Dodaj mimo to (Enter)',

    // Stats modal
    'modal.stats.header': 'Statystyki zakładek',
    'modal.stats.bookmarks': 'Zakładek',
    'modal.stats.folders': 'Folderów',
    'modal.stats.domains': 'Domen',
    'modal.stats.visits': 'Odwiedzin',
    'modal.stats.topVisited': 'Najczęściej odwiedzane',
    'modal.stats.foldersChart': 'Rozkład ilości stron w folderach',
    'modal.stats.domainsChart': 'Ilość zakładek per domena',
    'modal.stats.close': 'Zamknij (Esc)',
    'modal.stats.visitCount': '{count} odwiedzin',
    'modal.stats.noVisits': 'Brak danych o odwiedzinach',

    // Help modal
    'modal.help.header': 'Skróty klawiszowe',
    'modal.help.close': 'Zamknij (Esc)',
    'modal.help.modals': 'W modalach',
    'modal.help.closeModal': 'Zamknij modal',
    'modal.help.confirmAction': 'Potwierdź akcję',
    'modal.help.folderNav': 'Nawigacja po folderach',
    'modal.help.folderNavInput': 'Nawigacja (gdy fokus w inpucie)',
    'modal.help.moveAfter': 'Przenieś za',
    'modal.help.moveBefore': 'Przenieś nad',

    // Settings modal
    'settings.header': 'Ustawienia',
    'settings.support': 'Wesprzyj FuzzyMarks',
    'settings.close': 'Zamknij (Esc)',

    // Settings nav
    'settings.nav.appearance': 'Wygląd',
    'settings.nav.navigation': 'Nawigacja',
    'settings.nav.shortcuts': 'Skróty',
    'settings.nav.search': 'Wyszukiwarka',
    'settings.nav.pinned': 'Przypięte',
    'settings.nav.ui': 'Interfejs',
    'settings.nav.data': 'Dane',

    // Settings: Appearance panel
    'settings.appearance.header': 'Wygląd',
    'settings.appearance.language': 'Język',
    'settings.appearance.theme': 'Motyw',
    'settings.appearance.accentColor': 'Kolor akcentu',
    'settings.appearance.customColors': 'Dostosuj kolory',
    'settings.appearance.presets': 'Presety kolorów',
    'settings.appearance.presetPlaceholder': 'Nazwa presetu...',
    'settings.appearance.presetSave': 'Zapisz',
    'settings.appearance.bgOpacity': 'Przezroczystość tła',
    'settings.appearance.density': 'Gęstość wyświetlania',
    'settings.appearance.compact': 'Kompaktowy',
    'settings.appearance.normal': 'Normalny',
    'settings.appearance.spacious': 'Przestronny',
    'settings.appearance.contentWidth': 'Szerokość treści',
    'settings.appearance.searchFontSize': 'Rozmiar czcionki wyszukiwarki',
    'settings.appearance.showVisits': 'Pokaż licznik odwiedzin',

    // Settings: Navigation panel
    'settings.navigation.header': 'Nawigacja i zachowanie',
    'settings.navigation.doubleClick': 'Podwójne kliknięcie otwiera zakładkę',
    'settings.navigation.middleClick': 'Środkowy przycisk myszy — nowa karta',
    'settings.navigation.folderState': 'Stan folderów po starcie',
    'settings.navigation.remembered': 'Zapamiętane',
    'settings.navigation.collapsed': 'Zwinięte',
    'settings.navigation.expanded': 'Rozwinięte',
    'settings.navigation.defaultFolderStates': 'Domyślny stan folderów głównych',
    'settings.navigation.warnDuplicate': 'Ostrzeżenie o duplikacie URL',
    'settings.navigation.openAllThreshold': 'Próg potwierdzenia "Otwórz wszystkie"',
    'settings.navigation.openAllDisabled': 'wyłączone',
    'settings.navigation.openAllHint': '0 = bez potwierdzenia',

    // Settings: Shortcuts panel
    'settings.shortcuts.header': 'Skróty klawiszowe',
    'settings.shortcuts.resetAll': 'Przywróć wszystkie domyślne',
    'settings.shortcuts.resetOne': 'Przywróć domyślny',
    'settings.shortcuts.recording': 'Naciśnij skrót...',
    'settings.shortcuts.conflict': 'Konflikt: {label}',

    // Settings: Search panel
    'settings.search.header': 'Wyszukiwarka',
    'settings.search.debounce': 'Opóźnienie wyszukiwania',
    'settings.search.scope': 'Zakres wyszukiwania',
    'settings.search.scopeBoth': 'Tytuł + URL',
    'settings.search.scopeTitle': 'Tylko tytuł',
    'settings.search.scopeUrl': 'Tylko URL',
    'settings.search.placeholder': 'Placeholder',
    'settings.search.placeholderPlaceholder': 'Tekst w polu wyszukiwania',
    'search.defaultPlaceholder': 'Szukaj zakładek...',

    // Settings: Pinned panel
    'settings.pinned.header': 'Przypięte zakładki',
    'settings.pinned.limit': 'Limit przypiętych',
    'settings.pinned.showEmpty': 'Pokaż pasek gdy brak przypiętych',
    'settings.pinned.iconSize': 'Rozmiar ikon',
    'settings.pinned.small': 'Mały',
    'settings.pinned.normal': 'Normalny',
    'settings.pinned.large': 'Duży',

    // Settings: UI panel
    'settings.ui.header': 'Elementy interfejsu',
    'settings.ui.buttonVisibility': 'Widoczność przycisków',
    'settings.ui.btnHelp': 'Pomoc (?)',
    'settings.ui.btnStats': 'Statystyki',
    'settings.ui.btnAdd': 'Dodaj',
    'settings.ui.btnBg': 'Tło',
    'settings.ui.buttonPosition': 'Pozycja przycisków',
    'settings.ui.buttonOrder': 'Kolejność przycisków',
    'settings.ui.statsVisited': 'Statystyki — limit "Top odwiedzanych"',
    'settings.ui.statsFolders': 'Statystyki — limit "Top folderów"',
    'settings.ui.statsDomains': 'Statystyki — limit "Top domen"',

    // Settings: Data panel
    'settings.data.header': 'Dane',
    'settings.data.bookmarks': 'Zakładki',
    'settings.data.exportBookmarks': 'Eksportuj zakładki',
    'settings.data.importBookmarks': 'Importuj zakładki',
    'settings.data.settingsBackup': 'Kopia zapasowa ustawień',
    'settings.data.exportSettings': 'Eksportuj ustawienia',
    'settings.data.importSettings': 'Importuj ustawienia',
    'settings.data.resetData': 'Resetowanie danych',
    'settings.data.resetVisits': 'Resetuj liczniki odwiedzin',
    'settings.data.resetFolders': 'Resetuj stany folderów',
    'settings.data.resetPinned': 'Resetuj przypięte zakładki',

    // === JS dynamic strings ===

    // Theme labels
    'theme.light': 'Jasny',
    'theme.medium': 'Średni',
    'theme.dark': 'Ciemny',
    'theme.darkest': 'Najciemniejszy',

    // Color group labels
    'colors.background': 'Tło',
    'colors.surfaces': 'Powierzchnie',
    'colors.overlays': 'Nakładki',
    'colors.text': 'Tekst',

    // Shortcut categories
    'shortcuts.cat.navigation': 'Nawigacja',
    'shortcuts.cat.management': 'Zarządzanie zakładkami/folderami',
    'shortcuts.cat.tools': 'Widok i narzędzia',
    'shortcuts.cat.pinned': 'Przypięte zakładki',

    // Shortcut labels
    'shortcut.navUp': 'Nawigacja w górę',
    'shortcut.navDown': 'Nawigacja w dół',
    'shortcut.collapseFolder': 'Zwiń folder',
    'shortcut.expandFolder': 'Rozwiń folder',
    'shortcut.openOrToggle': 'Otwórz zakładkę/folder',
    'shortcut.openInNewTab': 'Otwórz w nowej karcie',
    'shortcut.jumpUp5': 'Skok 5 w górę',
    'shortcut.jumpDown5': 'Skok 5 w dół',
    'shortcut.goToStart': 'Początek listy',
    'shortcut.goToEnd': 'Koniec listy',
    'shortcut.newBookmark': 'Nowa zakładka',
    'shortcut.newFolder': 'Nowy folder',
    'shortcut.editSelected': 'Edytuj element',
    'shortcut.moveSelected': 'Przenieś do folderu',
    'shortcut.moveUp': 'Zmień kolejność w górę',
    'shortcut.moveDown': 'Zmień kolejność w dół',
    'shortcut.deleteSelected': 'Usuń element',
    'shortcut.undo': 'Cofnij akcję',
    'shortcut.pinBookmark': 'Przypnij zakładkę',
    'shortcut.focusSearch': 'Fokus na wyszukiwaniu',
    'shortcut.clearSearch': 'Wyczyść wyszukiwanie',
    'shortcut.toggleExpandAll': 'Rozwiń/zwiń foldery',
    'shortcut.openAllInFolder': 'Otwórz wszystkie z folderu',
    'shortcut.showStats': 'Statystyki',
    'shortcut.showHelp': 'Pomoc',
    'shortcut.showSettings': 'Ustawienia',
    'shortcut.pinnedNavLeft': 'Nawiguj w lewo',
    'shortcut.pinnedNavRight': 'Nawiguj w prawo',
    'shortcut.pinnedOpen': 'Otwórz',
    'shortcut.pinnedOpenNewTab': 'Otwórz w nowej karcie',
    'shortcut.pinnedReorderLeft': 'Zmień kolejność w lewo',
    'shortcut.pinnedReorderRight': 'Zmień kolejność w prawo',
    'shortcut.unpinBookmark': 'Odepnij zakładkę',
    'shortcut.exitPinnedMode': 'Wyjdź z trybu',

    // Button labels (order)
    'button.help': 'Pomoc (?)',
    'button.stats': 'Statystyki',
    'button.add': 'Dodaj',
    'button.settings': 'Ustawienia',
    'button.bg': 'Tło',

    // Root folder names
    'folder.toolbar': 'Pasek zakładek',
    'folder.menu': 'Menu zakładek',
    'folder.unfiled': 'Inne zakładki',
    'folder.mobile': 'Zakładki mobilne',

    // Confirm/alert dialogs
    'confirm.openAll': 'Otworzyć {count} zakładek w nowych kartach?',
    'confirm.resetVisits': 'Czy na pewno chcesz zresetować wszystkie liczniki odwiedzin?',
    'confirm.resetFolders': 'Czy na pewno chcesz zresetować stany folderów?',
    'confirm.resetPinned': 'Czy na pewno chcesz odpiąć wszystkie przypięte zakładki?',
    'confirm.importBookmarks': 'Znaleziono zakładki. Zostaną dodane do folderu "Import". Kontynuować?',
    'alert.importNoBookmarks': 'Nie znaleziono zakładek w pliku.',
    'alert.importInvalid': 'Nieprawidłowy plik backupu.',
    'alert.importError': 'Błąd importu: {message}',
    'alert.importBookmarksError': 'Błąd importu zakładek: {message}',

    // Stats
    'stats.visitCount': '{count} odwiedzin',
    'stats.noVisits': 'Brak danych o odwiedzinach',
    'stats.rootFolder': 'Główny',

    // Visit count in tree
    'tree.visits': '{count} wizyta',
    'tree.visitsPlural': '{count} wizyt',

    // Presets
    'presets.empty': 'Brak zapisanych presetów',
    'presets.custom': 'Własny',
    'presets.preset': 'Preset',
    'presets.deleteTitle': 'Usuń preset',
    'presets.resetTitle': 'Resetuj do motywu',

    // Duplicate
    'duplicate.rootFolder': 'Katalog główny',

    // Error
    'error.loadBookmarks': 'Nie udało się załadować zakładek',

    // Position titles
    'position.topLeft': 'Lewy górny',
    'position.topRight': 'Prawy górny',
    'position.bottomLeft': 'Lewy dolny',
    'position.bottomRight': 'Prawy dolny',
  }
};

/**
 * Get translation for a key, with optional parameter interpolation.
 * @param {string} key - Translation key
 * @param {Object} [params] - Parameters for interpolation, e.g. {count: 5}
 * @returns {string} Translated string
 */
function t(key, params) {
  const lang = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  let str = lang[key];
  if (str === undefined) {
    // Fallback to English
    str = TRANSLATIONS.en[key];
  }
  if (str === undefined) {
    console.warn(`Missing translation key: ${key}`);
    return key;
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
  }
  return str;
}

/**
 * Apply translations to all DOM elements with data-i18n attributes.
 * - data-i18n="key" → sets textContent
 * - data-i18n-attr="placeholder:key,title:key" → sets attribute values
 */
function applyI18nToDom() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  // Attributes
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const pairs = el.getAttribute('data-i18n-attr').split(',');
    for (const pair of pairs) {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (attr && key) {
        el.setAttribute(attr, t(key));
      }
    }
  });
}

/**
 * Switch language at runtime.
 * @param {string} lang - Language code ('en' or 'pl')
 */
function switchLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  if (typeof appSettings !== 'undefined') {
    appSettings.language = lang;
    saveSettings();
  }
  document.documentElement.lang = lang;
  applyI18nToDom();
  // Re-render dynamic UI components
  if (typeof applySettings === 'function') applySettings();
  if (typeof renderSettingsUI === 'function') renderSettingsUI();
  if (typeof updateShortcutDisplays === 'function') updateShortcutDisplays();
  if (typeof renderBookmarksTree === 'function') renderBookmarksTree();
  if (typeof renderPinnedBar === 'function') renderPinnedBar();
}
