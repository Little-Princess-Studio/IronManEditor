type IpcChannel = 'file:change';

declare interface Window {
  electron: {
    dialog: {
      showOpenDialog(options: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue>;
      showSaveDialog(options: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue>;
    };
    file: {
      readFile(filepath: string): Promise<IpcResponse<IFileData>>;
      readFolder(folderPath: string): Promise<IpcResponse<IFileData[]>>;
      watchFile(filepath: string): void;
    };
    path: {
      isDirectory(path: string): Promise<boolean>;
      basename(path: string): Promise<string>;
      dirname(path: string): Promise<string>;
    };
    ipcRenderer: {
      on(channel: IpcChannel, func: (res: any) => void): void;
      once(channel: IpcChannel, func: (res: any) => void): void;
    };
    window: {
      setTitle(title: string): Promise<void>;
    };
  };
}

interface IpcResponse<T = unknown> {
  data: T;
  success: boolean;
}

type IFileData = {
  name: string;
  path: string;
  isDir: boolean;
  content?: string;
  children?: IFileData;
};
