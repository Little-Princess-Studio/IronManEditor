import React, { useState, useEffect } from 'react';
import './index.less';

const EditorActions: React.FC = () => {
  return (
    <ul className="actions-container">
      <li className="action-item select-none inline-flex items-center justify-end">meta config</li>
      <li className="action-item select-none cursor-pointer inline-flex items-center justify-end active">scripts</li>
      <li className="action-item select-none inline-flex items-center justify-end">database</li>
    </ul>
  );
};

export default EditorActions;
