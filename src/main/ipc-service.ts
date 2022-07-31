import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import fsPromises from 'fs/promises';
import PathUtil from 'path';
import fsWatcher from './fs-watcher';

const wrapIpcResponse = (data: any, success = true) => {
  return { success, data };
};

export const readFileOrFolder = async (path: string): Promise<IFileData | IFileData[]> => {
  if (!existsSync(path)) {
    throw new Error('Path Not Exists');
  }

  try {
    if (statSync(path).isFile()) {
      const content = await fsPromises.readFile(path, { encoding: 'utf8' });
      return { name: PathUtil.basename(path), path, isDir: false, content };
    }

    if (statSync(path).isDirectory()) {
      const files = await fsPromises.readdir(path);

      const fileData: IFileData[] = [];

      for (let i = 0, len = files.length; i < len; i++) {
        const ext = PathUtil.extname(files[i]).toLowerCase();

        if (ext && ext !== '.json' && ext !== '.json5') {
          continue;
        }

        const fullPath = PathUtil.join(path, files[i]);
        const isDir = statSync(fullPath).isDirectory();

        if (!ext && !isDir) {
          continue;
        }

        fileData.push({
          name: files[i],
          path: fullPath,
          isDir,
          content: isDir ? undefined : readFileSync(fullPath, { encoding: 'utf8' }),
        });
      }

      return fileData;
    }

    throw new Error('Path Not Support');
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default class IpcService {
  readonly mainWindow: BrowserWindow;

  schemas: { [name: string]: any } = {};

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  init() {
    this.initSchemas();
    this.initDialogHandler();
    this.initFileHandler();
    this.initPathHandler();
    this.initWindowHandler();
  }

  destroy() {
    ipcMain.removeAllListeners();
    fsWatcher.removeAllListeners();
  }

  private initSchemas() {
    const RESOURCES_PATH = app.isPackaged ? PathUtil.join(process.resourcesPath, 'assets') : PathUtil.join(__dirname, '../../assets');
    const dirPath = PathUtil.join(RESOURCES_PATH, './schemas');
    const dir = readdirSync(dirPath);

    for (let i = 0, len = dir.length; i < len; i++) {
      const file = dir[i];

      if (file.endsWith('.json')) {
        this.schemas[PathUtil.basename(file, '.json')] = JSON.parse(readFileSync(PathUtil.join(dirPath, file), 'utf-8'));
      }
    }

    console.log(this.schemas);

    ipcMain.handle('schema', () => {
      return this.schemas;
    });
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

    ipcMain.handle('path:basename', (event, path) => PathUtil.basename(path));

    ipcMain.handle('path:dirname', (event, path) => PathUtil.dirname(path));
  }

  private initWindowHandler() {
    ipcMain.on('window:title', (event, title) => {
      this.mainWindow.setTitle(title);
    });
  }
}
