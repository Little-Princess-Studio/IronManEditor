import { BrowserWindow, dialog, ipcMain } from 'electron';

export default class IpcService {
  readonly mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  init() {
    this.initDialog();
  }

  private initDialog() {
    ipcMain.handle('dialog:open', async (event, arg) => {
      const result = await dialog.showOpenDialog(arg);
      return result;
    });

    ipcMain.handle('dialog:save', async (event, arg) => {
      const result = await dialog.showSaveDialog(arg);
      return result;
    });
  }
}
