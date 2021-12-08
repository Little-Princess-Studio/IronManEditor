import { useHistory } from 'react-router-dom';
import './index.less';

const StartPage: React.FC = () => {
  const history = useHistory();

  const handleCreate = () => {
    // TODO:
  };

  const handleOpen = async () => {
    const res = await window.electron.dialog.showOpenDialog({
      filters: [{ name: 'Files', extensions: ['json', 'json5'] }],
      properties: ['openFile'],
    });

    if (!res.canceled && res.filePaths.length > 0) {
      const filePath = res.filePaths[0];

      window.electron.ipcRenderer.once('file:read:result', (resp: IpcResponse) => {
        if (resp.success) {
          console.log('file:', resp.data);
          history.replace('/editor');
        } else {
          console.warn(resp);
        }
      });

      window.electron.file.readFile(filePath);
    }
  };

  return (
    <div className="start-page-container flex-center">
      <div className="start-page-section-wrap">
        <div className="start-page-section">
          <h3>启动</h3>
          <div className="start-btn" onClick={handleCreate}>
            新建文件...
          </div>
          <div className="start-btn" onClick={handleOpen}>
            打开文件...
          </div>
        </div>
        <div className="start-page-section">
          <h3>最近</h3>
          {/* TODO: */}
        </div>
      </div>
    </div>
  );
};

export default StartPage;
