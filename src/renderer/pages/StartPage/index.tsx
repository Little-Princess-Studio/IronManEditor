import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateWorkSpace } from '@renderer/store/reducers/workspace';
import settings, { IRecentProject } from '@renderer/helpers/settings';
import './index.less';

const StartPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [projects, setProjects] = useState(settings.recentProjects.slice(0, 5));

  const openingFileRef = useRef(false);
  const openingFolderRef = useRef(false);

  useEffect(() => {
    window.electron.window.setTitle('IronMan Editor');
  }, []);

  // FIXME:
  const handleCreate = () => {
    dispatch(updateWorkSpace({ fileName: 'New File' }));
    history.replace('/editor');
    window.electron.window.setTitle('New File');
  };

  const openProject = async (filePath: string) => {
    const resp = await window.electron.file.readFile(filePath);

    if (resp.success) {
      console.log('file:', resp.data);
      history.replace('/editor');

      dispatch(updateWorkSpace(resp.data));
      window.electron.file.watchFile(filePath);
      window.electron.window.setTitle(`${resp.data.fileName} - ${filePath}`);

      settings.registerProject({ name: resp.data.fileName, path: filePath, isDir: false });
    } else {
      console.warn(resp);
    }
  };

  const openProjectFolder = async (folderPath: string) => {
    const resp = await window.electron.file.readFolder(folderPath);

    if (resp.success) {
      console.log('folder:', resp.data);
      history.replace('/editor');

      dispatch(updateWorkSpace(resp.data));
      window.electron.window.setTitle(`${resp.data.fileName} - ${folderPath}`);

      settings.registerProject({ name: resp.data.fileName, path: folderPath, isDir: true });
    } else {
      console.warn(resp);
    }
  };

  const removeProject = (it: IRecentProject) => {
    settings.unregisterProject(it);
    setProjects(settings.recentProjects.slice(0, 5));
  };

  const handleOpenFile = async () => {
    // handle fast click
    if (openingFileRef.current) {
      return;
    }

    openingFileRef.current = true;

    try {
      const res = await window.electron.dialog.showOpenDialog({
        title: '打开文件',
        filters: [{ name: 'Files', extensions: ['json', 'json5'] }],
        properties: ['openFile'],
      });

      if (!res.canceled && res.filePaths.length > 0) {
        const filePath = res.filePaths[0];
        await openProject(filePath);
      }
    } catch (err) {
      console.error(err);
    } finally {
      openingFileRef.current = false;
    }
  };

  const handleOpenFolder = async () => {
    // handle fast click
    if (openingFolderRef.current) {
      return;
    }

    openingFolderRef.current = true;

    try {
      const res = await window.electron.dialog.showOpenDialog({
        title: '打开文件夹',
        properties: ['openFile', 'openDirectory'],
      });

      if (!res.canceled && res.filePaths.length > 0) {
        await openProjectFolder(res.filePaths[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      openingFolderRef.current = false;
    }
  };

  const tryOpenProject = async (path: string) => {
    try {
      const isDir = await window.electron.path.isDirectory(path);

      console.log(`isDir(${path}): ${isDir}`);

      if (isDir) {
        openProjectFolder(path);
      } else {
        openProject(path);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="full-screen start-page-container flex-center">
      <div className="start-page-section-wrap">
        <div className="start-page-section">
          <h3>启动</h3>
          <div className="start-btn ellipsis" onClick={handleCreate}>
            新建文件...
          </div>
          <div className="start-btn ellipsis" onClick={handleOpenFile}>
            打开文件...
          </div>
          <div className="start-btn ellipsis" onClick={handleOpenFolder}>
            打开文件夹...
          </div>
        </div>
        <div className="start-page-section" style={{ width: 380 }}>
          <h3>最近</h3>
          {projects.length === 0 && <div className="recent-project-item ellipsis">你最近没有使用的文件/文件夹</div>}
          {projects.map((it) => (
            <div className="recent-project-item ellipsis" key={it.path}>
              <button type="button" className="recent-project-name" title={it.path} onClick={() => tryOpenProject(it.path)}>
                {it.name}
              </button>
              <span className="recent-project-path" title={it.path}>
                {it.path}
              </span>
              <i className="recent-project-close select-none cursor-pointer" onClick={() => removeProject(it)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartPage;
