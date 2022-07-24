import React, { useState, useEffect } from 'react';
import EditorActions from './EditorActions';
import ExplorerFolder from './ExplorerFolder';
import FileViewer from './FileViewer';
import './index.less';

const EditorPage: React.FC = () => {
  return (
    <div className="full-screen editor-root">
      <div className="h-full flex-shrink-0 composite-bar">
        <EditorActions />
      </div>
      <div className="h-full flex-shrink-0">
        <ExplorerFolder />
      </div>
      <div className="h-full flex-grow">
        <FileViewer />
      </div>
    </div>
  );
};

export default EditorPage;
