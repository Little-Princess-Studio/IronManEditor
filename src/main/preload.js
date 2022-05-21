const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on(channel, func) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    once(channel, func) {
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    },
  },
  dialog: {
    showOpenDialog(options) {
      return ipcRenderer.invoke('dialog:open', options);
    },
    showSaveDialog(options) {
      return ipcRenderer.invoke('dialog:save', options);
    },
  },
  file: {
    readFile(filepath) {
      return ipcRenderer.invoke('file:read', filepath);
    },
    readFolder(folderpath) {
      return ipcRenderer.invoke('folder:read', folderpath);
    },
    watchFile(filepath) {
      ipcRenderer.send('file:watch', filepath);
    },
  },
  window: {
    setTitle(title) {
      ipcRenderer.send('window:title', title);
    },
  },
});
