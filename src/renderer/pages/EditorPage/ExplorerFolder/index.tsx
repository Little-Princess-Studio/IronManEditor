import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@renderer/store/configureStore';
import { Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import 'antd/lib/tree/style';
import './index.less';

const ExplorerFolder: React.FC = () => {
  const { fileData } = useSelector((state: RootState) => state.workspace);
  const inputRef = useRef<HTMLInputElement>(null);

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
        data: it,
        children: it.isDir && it.children ? renderTreeNode(it.children) : undefined,
      }));
    };

    return renderTreeNode(fileData);
  }, [fileData]);

  const onLoadData = (treeNode) => {
    // TODO:
    return Promise.resolve();
  };

  return (
    <div className="h-full explorer-folders-view">
      <div className="file-search-wrap">
        <input className="file-filter-input" placeholder="Search Script..." ref={inputRef} onKeyDown={onKeyDown} />
        <i className="file-filter-input-icon cursor-pointer" onClick={() => onSearch()} />
      </div>
      <div className="file-list-wrap">
        <Tree treeData={treeData} loadData={onLoadData} />
      </div>
    </div>
  );
};

export default ExplorerFolder;
