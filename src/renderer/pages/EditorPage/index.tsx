import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './index.less';

const EditorPage: React.FC = () => {
  return (
    <div className="full-screen editor-root">
      <div className="h-full flex-shrink-0 composite-bar">{/* TODO: */}</div>
      <div className="h-full flex-shrink-0 explorer-folders-view">{/* TODO: */}</div>
      <div className="h-full flex-grow">{/* TODO: */}</div>
    </div>
  );
};

export default EditorPage;
