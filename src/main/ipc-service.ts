import { BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import fsWatcher from './fs-watcher';

const wrapIpcResponse = (data: any, success = true) => {
  return { success, data };
};

export function readFile(filepath: string, callback: (res: any) => void) {
  if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
    fs.readFile(filepath, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        callback(wrapIpcResponse({ name: err.name, message: err.message, code: err.code }, false));
      } else {
        callback(wrapIpcResponse({ fileName: path.basename(filepath), filePath: filepath, fileData: data }));
      }
    });
  }
}

export default class IpcService {
  readonly mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  init() {
    this.initDialogHandler();
    this.initFileHandler();
    this.initWindowHandler();
  }

  destroy() {
    ipcMain.removeAllListeners();
    fsWatcher.removeAllListeners();
  }

  private initDialogHandler() {
    ipcMain.handle('dialog:open', async (event, arg) => {
      const result = await dialog.showOpenDialog(arg);
      return result;
    });

    ipcMain.handle('dialog:save', async (event, arg) => {
      const result = await dialog.showSaveDialog(arg);
      return result;
    });
  }

  private initFileHandler() {
    ipcMain.on('file:read', (event, filepath) => {
      console.log('filepath:', filepath);

      readFile(filepath, (res) => {
        event.sender.send('file:read:result', res);
      });
    });

    ipcMain.on('file:watch', (event, filepath: string) => {
      fsWatcher.add(filepath);
    });

    fsWatcher.on('change', (filepath) => {
      readFile(filepath, (res) => {
        this.mainWindow?.webContents.send('file:change', res);
      });
    });
  }

  private initWindowHandler() {
    ipcMain.on('window:title', (event, title) => {
      this.mainWindow.setTitle(title);
    });
  }
}
