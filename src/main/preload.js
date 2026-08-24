// Preload — safely bridge Electron APIs to the renderer via contextBridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Data persistence ──────────────────────────────────────────────────────
  getAllData: () => ipcRenderer.invoke('store:getAll'),
  setData: (key, value) => ipcRenderer.invoke('store:set', key, value),

  // ── CSV export ────────────────────────────────────────────────────────────
  exportCSV: (csvContent, defaultFilename) =>
    ipcRenderer.invoke('export:csv', csvContent, defaultFilename),
  exportBackup: () => ipcRenderer.invoke('export:backup'),
  importBackup: () => ipcRenderer.invoke('import:backup'),

  // ── Window controls ───────────────────────────────────────────────────────
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
});
