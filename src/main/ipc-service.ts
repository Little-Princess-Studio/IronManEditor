import { BrowserWindow, dialog, ipcMain } from 'electron';
import { existsSync, statSync } from 'fs';
import fsPromises from 'fs/promises';
import PathUtil from 'path';
import fsWatcher from './fs-watcher';

const wrapIpcResponse = (data: any, success = true) => {
  return { success, data };
};

export const readFileOrFolder = async (path: string): Promise<any> => {
  if (!existsSync(path)) {
    throw new Error('Path Not Exists');
  }

  try {
    if (statSync(path).isFile()) {
      const content = await fsPromises.readFile(path, { encoding: 'utf8' });
      return { fileName: PathUtil.basename(path), filePath: path, fileData: content, isDir: false };
    }

    if (statSync(path).isDirectory()) {
      const files = await fsPromises.readdir(path);
      return { fileName: PathUtil.basename(path), filePath: path, fileData: files, isDir: true };
    }

    throw new Error('Path Not Support');
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default class IpcService {
  readonly mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  init() {
    this.initDialogHandler();
    this.initFileHandler();
    this.initPathHandler();
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
    ['file:read', 'folder:read'].forEach((key) => {
      ipcMain.handle(key, async (event, path) => {
        console.log('read file:', path);

        const res = await readFileOrFolder(path)
          .then((value) => {
            return wrapIpcResponse(value, true);
          })
          .catch((err) => wrapIpcResponse(err, false));

        return res;
      });
    });

    ipcMain.on('file:watch', (event, filepath: string) => {
      fsWatcher.add(filepath);
    });

    fsWatcher.on('change', async (filepath) => {
      const res = await readFileOrFolder(filepath)
        .then((value) => {
          return wrapIpcResponse(value, true);
        })
        .catch((err) => wrapIpcResponse(err, false));
      this.mainWindow?.webContents.send('file:change', res);
    });
  }

  private initPathHandler() {
    ipcMain.handle('path:isDirectory', async (event, arg) => {
      if (!existsSync(arg)) {
        return Promise.reject('path not exists');
      }

      return statSync(arg).isDirectory();
    });
  }

  private initWindowHandler() {
    ipcMain.on('window:title', (event, title) => {
      this.mainWindow.setTitle(title);
    });
  }
}
