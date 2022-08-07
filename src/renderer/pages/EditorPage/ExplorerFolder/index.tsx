import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { RootState } from '@renderer/store/configureStore';
import workspaceMode from '@renderer/store/reducers/workspace';
import workfileMode from '@renderer/store/reducers/workfile';
import { Tree } from 'antd';
import { DataNode, DirectoryTreeProps } from 'antd/lib/tree';
import './index.less';

const { DirectoryTree } = Tree;

const ExplorerFolder: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const { fileData, workspaceName, workspaceDir, trashList, renameItem } = useSelector((state: RootState) => state.workspace);
  const folderListRef = useRef<{ [path: string]: IFileData }>({});
  const inputRef = useRef<HTMLInputElement>(null);

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
      const arr = [];

      for (let i = 0, len = list.length; i < len; i++) {
        const it = list[i];

        // hide trash item
        if (trashList.length > 0 && trashList.findIndex((trashItem) => trashItem.path === it.path && trashItem.isDir === it.isDir) > -1) {
          continue;
        }

        let title: React.ReactNode = it.name;
        if (renameItem && renameItem.path === it.path && renameItem.isDir === it.isDir) {
          // FIXME:
          title = <input defaultValue={it.name} onBlur={() => workspaceMode.renameItem(null)} />;
        }

        arr.push({
          title,
          key: it.path,
          isLeaf: !it.isDir,
          selectable: !it.isDir,
          children: it.isDir && it.children ? renderTreeNode(it.children) : undefined,
        });
      }

      return arr;
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
  }, [fileData, workspaceName, workspaceDir, trashList, renameItem]);

  const onLoadData: DirectoryTreeProps['loadData'] = async (treeNode) => {
    const { key, isLeaf } = treeNode;

    if (!isLeaf) {
      console.log('before onLoadData:', key);

      const resp = await window.electron.file.readFolder(key as string);

      if (resp.success) {
        folderListRef.current[key].children = resp.data;

        workspaceMode.updateWorkSpace({ fileData: [...fileData] });

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

    workfileMode.updateWorkFile({ path: '', content: '' });

    try {
      const resp = await window.electron.file.readFile(selectedKeys[0] as string);

      if (!resp.success) {
        throw resp;
      }

      workfileMode.updateWorkFile({ path: selectedKeys[0] as string, content: resp.data.content });
    } catch (err) {
      console.log(err);
    }
  };

  const onRightClick: DirectoryTreeProps['onRightClick'] = ({ event, node }) => {
    // ignore root node
    if (node.pos === '0-0') {
      return;
    }

    console.log(node);
    window.electron.menu.showExplorerMenu(node.key as string, !node.isLeaf);
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
