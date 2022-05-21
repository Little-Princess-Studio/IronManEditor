type IpcChannel = 'file:read:result' | 'folder:read:result' | 'file:change';

declare interface Window {
  electron: {
    dialog: {
      showOpenDialog(options: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue>;
      showSaveDialog(options: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue>;
    };
    file: {
      readFile(filepath: string): void;
      readFolder(folderpath: string): void;
      watchFile(filepath: string): void;
    };
    ipcRenderer: {
      on(channel: IpcChannel, func: (res: any) => void): void;
      once(channel: IpcChannel, func: (res: any) => void): void;
    };
    window: {
      setTitle(title: string): void;
    };
  };
}

interface IpcResponse {
  data: any;
  success: boolean;
}
