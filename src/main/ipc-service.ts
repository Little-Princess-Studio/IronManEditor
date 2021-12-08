import { BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'fs';

const wrapIpcResponse = (data: any, success = true) => {
  return { success, data };
};

export default class IpcService {
  readonly mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  init() {
    this.initDialogHandler();
    this.initFileHandler();
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

      if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
        fs.readFile(filepath, { encoding: 'utf8' }, (err, data) => {
          if (err) {
            event.sender.send('file:read:result', wrapIpcResponse({ name: err.name, message: err.message, code: err.code }, false));
          } else {
            event.sender.send('file:read:result', wrapIpcResponse(data));
          }
        });
      }
    });
  }
}
