import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import JSON5 from 'json5';
import ScriptEditor from './ScriptEditor';
import MonacoEditor from './MonacoEditor';
import emitter from '../../helpers/emitter';
import useHorizontalResizer from '@renderer/hooks/useHorizontalResizer';
import './index.less';

const EditorPage: React.FC = () => {
  const { fileData } = useSelector<any, { fileData: string; filePath: string }>((state) => state.workspace);
  const [scriptEditing, setScriptEditing] = useState(false);
  const [scriptData, setScriptData] = useState({});

  const [resizerRef, leftChildRef, rightChildRef] = useHorizontalResizer<HTMLDivElement, HTMLDivElement, HTMLDivElement>();

  useEffect(() => {
    try {
      const result = JSON5.parse(fileData);

      console.log('jsonData:', result);

      if ('event_type' in result) {
        setScriptData(result);
        setScriptEditing(true);
        emitter.emit('editor:resize');
      }
    } catch (err) {
      console.log(err);
    }
  }, [fileData]);

  useEffect(() => {
    window.electron.ipcRenderer.on('file:change', (result) => {
      console.log('===file change===', result);

      // TODO: handle file change
    });
  }, []);

  return (
    <div className={`full-screen editor-container ${scriptEditing ? '' : 'monaco-only'}`}>
      {scriptEditing && (
        <div className="editor-panel editor-panel-left" ref={leftChildRef}>
          <ScriptEditor data={scriptData} />
        </div>
      )}
      <div className="h-resizer" ref={resizerRef} />
      <div className="editor-panel editor-panel-right" ref={rightChildRef}>
        <MonacoEditor />
      </div>
    </div>
  );
};

export default EditorPage;
