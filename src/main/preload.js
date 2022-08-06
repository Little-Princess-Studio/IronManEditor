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
    readFolder(folderPath) {
      return ipcRenderer.invoke('folder:read', folderPath);
    },
    watchFile(filepath) {
      ipcRenderer.send('file:watch', filepath);
    },
    writeFile(path, content) {
      return ipcRenderer.invoke('file:write', path, content);
    },
  },
  path: {
    isDirectory(path) {
      return ipcRenderer.invoke('path:isDirectory', path);
    },
    basename(path) {
      return ipcRenderer.invoke('path:basename', path);
    },
    dirname(path) {
      return ipcRenderer.invoke('path:dirname', path);
    },
  },
  window: {
    setTitle(title) {
      ipcRenderer.send('window:title', title);
    },
  },
  menu: {
    showExplorerMenu(path, isDir) {
      ipcRenderer.send('menu:explorer', path, isDir);
    },
  },
  schema() {
    return ipcRenderer.invoke('schema');
  },
});
