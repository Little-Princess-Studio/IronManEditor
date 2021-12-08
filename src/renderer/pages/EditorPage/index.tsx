import React, { useState, useEffect } from 'react';
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

  return (
    <div className="full-screen editor-container">
      {scriptEditing && (
        <div className="editor-split-left">
          <ScriptEditor data={scriptData} />
        </div>
      )}
      {/* TODO: divider */}
      <div className="editor-split-right">
        <MonacoEditor />
      </div>
    </div>
  );
};

export default EditorPage;
