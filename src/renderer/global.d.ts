declare interface Window {
  electron: {
    dialog: {
      showOpenDialog(options: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue>;
      showSaveDialog(options: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue>;
    };
    file: {
      readFile(filepath: string): void;
    };
    ipcRenderer: {
      on(channel: string, func: (res: any) => void): void;
      once(channel: string, func: (res: any) => void): void;
    };
    window: {
      setTitle(title: string): void;
    }
  };
}

interface IpcResponse {
  data: any;
  success: boolean;
}
