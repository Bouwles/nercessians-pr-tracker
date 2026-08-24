// Nercessian's PR Tracker — Electron Main Process
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

// Initialize persistent data store
const store = new Store({
  name: 'pr-tracker-data',
  defaults: {
    profile: null,
    exercises: [],
  },
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1340,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#0a0a0a',
    frame: false, // Custom title bar
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // In production, load from the dist folder
  const indexPath = path.join(__dirname, '../../dist/index.html');
  mainWindow.loadFile(indexPath);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ─── Window Control IPC ──────────────────────────────────────────────────────

ipcMain.on('window:minimize', () => mainWindow?.minimize());
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.on('window:close', () => mainWindow?.close());

// ─── Store IPC ────────────────────────────────────────────────────────────────

// Get all stored data
ipcMain.handle('store:getAll', () => store.store);

// Set a top-level key (e.g. 'profile' or 'exercises')
ipcMain.handle('store:set', (event, key, value) => {
  store.set(key, value);
  return true;
});

// ─── CSV Export IPC ───────────────────────────────────────────────────────────

ipcMain.handle('export:csv', async (event, csvContent, defaultFilename) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export PR Data as CSV',
    defaultPath: defaultFilename || 'pr-data.csv',
    filters: [{ name: 'CSV Files', extensions: ['csv'] }],
  });

  if (result.canceled || !result.filePath) return { success: false };

  try {
    fs.writeFileSync(result.filePath, csvContent, 'utf8');
    return { success: true, filePath: result.filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('export:backup', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export PR Tracker Backup',
    defaultPath: `pr-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`,
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  });

  if (result.canceled || !result.filePath) return { success: false };

  try {
    fs.writeFileSync(result.filePath, JSON.stringify(store.store, null, 2), 'utf8');
    return { success: true, filePath: result.filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('import:backup', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Import PR Tracker Backup',
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  });

  if (result.canceled || !result.filePaths?.[0]) return { success: false };

  try {
    const parsed = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8'));
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.exercises)) {
      return { success: false, error: 'Backup file is missing exercise data.' };
    }
    store.set('profile', parsed.profile || null);
    store.set('exercises', parsed.exercises);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
