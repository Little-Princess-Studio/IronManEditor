import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import JSON5 from 'json5';
import ScriptEditor from './ScriptEditor';
import MonacoEditor from './MonacoEditor';
import emitter from '../../helpers/emitter';
import './index.less';

const EditorPage: React.FC = () => {
  const { fileData } = useSelector<any, { fileData: string; filePath: string }>((state) => state.workspace);
  const [scriptEditing, setScriptEditing] = useState(false);
  const [scriptData, setScriptData] = useState({});
  const resizerRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const resizer = resizerRef.current;

    if (!resizer) {
      return;
    }

    let resizing = false;

    const onMouseDown = () => {
      resizing = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!resizing) {
        return;
      }

      const panelRight = panelRightRef.current;

      if (!panelRight) {
        return;
      }

      requestAnimationFrame(() => {
        panelRight.style.width = `${window.innerWidth - e.pageX}px`;
        emitter.emit('editor:resize');
      });
    };

    const onMouseUp = () => {
      resizing = false;
    };

    resizer.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      resizer.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className={`full-screen editor-container ${scriptEditing ? '' : 'monaco-only'}`}>
      {scriptEditing && (
        <div className="editor-panel editor-panel-left">
          <ScriptEditor data={scriptData} />
        </div>
      )}
      <div className="h-resizer" ref={resizerRef} />
      <div className="editor-panel editor-panel-right" ref={panelRightRef}>
        <MonacoEditor />
      </div>
    </div>
  );
};

export default EditorPage;
