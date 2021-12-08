import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as monaco from 'monaco-editor';
import throttle from 'lodash/throttle';

const workerSuffix = process.env.NODE_ENV === 'development' ? '.dev' : '';

// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: any, label: string) {
    if (label === 'json') {
      return `./json.worker${workerSuffix}.js`;
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return `./css.worker${workerSuffix}.js`;
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return `./html.worker${workerSuffix}.js`;
    }
    if (label === 'typescript' || label === 'javascript') {
      return `./ts.worker${workerSuffix}.js`;
    }
    return `./editor.worker${workerSuffix}.js`;
  },
};

const EditorPage: React.FC = () => {
  const fileData = useSelector<any, string>((state) => state.workspace.fileData);
  const divEl = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  useEffect(() => {
    if (divEl.current) {
      // @ts-ignore
      editorRef.current = monaco.editor.create(divEl.current, {
        value: fileData,
        language: 'json',
        mouseWheelZoom: true,
        renderWhitespace: 'all',
      });
    }
    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const onResize = throttle(() => {
      editorRef.current?.layout();
    }, 16);

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <div className="full-screen" ref={divEl} />;
};

export default EditorPage;
