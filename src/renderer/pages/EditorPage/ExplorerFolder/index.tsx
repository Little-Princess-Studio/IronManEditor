import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { RootState } from '@renderer/store/configureStore';
import { updateWorkSpace } from '@renderer/store/reducers/workspace';
import { updateWorkFile } from '@renderer/store/reducers/workfile';
import { Tree } from 'antd';
import { DataNode, DirectoryTreeProps } from 'antd/lib/tree';
import './index.less';

const { DirectoryTree } = Tree;

const ExplorerFolder: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const { fileData, workspaceName, workspaceDir } = useSelector((state: RootState) => state.workspace);
  const folderListRef = useRef<{ [path: string]: IFileData }>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const cacheFileData = (list: IFileData[]) => {
    for (let i = 0, len = list.length; i < len; i++) {
      const { isDir, path } = list[i];
      if (!isDir) {
        continue;
      }

      if (!folderListRef.current[path]) {
        folderListRef.current[path] = list[i];
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(fileData) && fileData.length > 0 && Object.keys(folderListRef.current).length === 0) {
      cacheFileData(fileData);
    }
  }, [fileData]);

  useEffect(() => {
    setExpandedKeys([workspaceDir]);
  }, [workspaceDir]);

  useHotkeys('ctrl+p', () => {
    // TODO:
    console.log('ctrl+p');
  });

  const onSearch = (value?: string) => {
    value = value || inputRef.current?.value;

    // TODO: handle search file
    console.log('handle search file', value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // enter
    if (e.keyCode === 13) {
      e.preventDefault();
      // @ts-ignore
      onSearch(e.target.value);
    }
  };

  const treeData = useMemo(() => {
    const renderTreeNode = (list: IFileData[]): DataNode[] => {
      return list.map((it) => ({
        title: it.name,
        key: it.path,
        isLeaf: !it.isDir,
        selectable: !it.isDir,
        children: it.isDir && it.children ? renderTreeNode(it.children) : undefined,
      }));
    };

    return [
      {
        className: 'root-folder-treenode',
        title: (
          <>
            <span>{workspaceName}</span>
            <i
              className="icon-collapse-all"
              onClickCapture={(e) => {
                setExpandedKeys([workspaceDir]);
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          </>
        ),
        key: workspaceDir,
        icon: () => null,
        isLeaf: false,
        selectable: false,
        children: renderTreeNode(fileData),
      },
    ];
  }, [fileData, workspaceName, workspaceDir]);

  const onLoadData: DirectoryTreeProps['loadData'] = async (treeNode) => {
    const { key, isLeaf } = treeNode;

    if (!isLeaf) {
      console.log('before onLoadData:', key);

      const resp = await window.electron.file.readFolder(key as string);

      if (resp.success) {
        folderListRef.current[key].children = resp.data;

        dispatch(updateWorkSpace({ fileData: [...fileData] }));

        cacheFileData(resp.data);
      } else {
        return Promise.reject(resp);
      }
    }

    return Promise.resolve();
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (expandedKeys) => {
    setExpandedKeys(expandedKeys as string[]);
  };

  const onSelect: DirectoryTreeProps['onSelect'] = async (selectedKeys, info) => {
    if (selectedKeys.length < 1) {
      return;
    }

    updateWorkFile(dispatch, { path: '', content: '' });

    try {
      const resp = await window.electron.file.readFile(selectedKeys[0] as string);

      if (!resp.success) {
        throw resp;
      }

      updateWorkFile(dispatch, { path: selectedKeys[0] as string, content: resp.data.content });
    } catch (err) {
      console.log(err);
    }
  };

  const onRightClick: DirectoryTreeProps['onRightClick'] = ({ event, node }) => {
    if (node.isLeaf) {
      return;
    }

    // TODO: new file
    console.log(event, node);
  };

  return (
    <div className="h-full explorer-folders-view">
      <div className="file-search-wrap">
        <input className="file-filter-input" placeholder="Search Script..." ref={inputRef} onKeyDown={onKeyDown} />
        <i className="file-filter-input-icon cursor-pointer" onClick={() => onSearch()} />
      </div>
      <div className="file-list-wrap">
        <DirectoryTree
          expandedKeys={expandedKeys}
          treeData={treeData}
          loadData={onLoadData}
          onExpand={onExpand}
          onSelect={onSelect}
          onRightClick={onRightClick}
        />
      </div>
    </div>
  );
};

export default ExplorerFolder;
