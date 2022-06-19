import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as monaco from 'monaco-editor';
import emitter from '@renderer/helpers/emitter';
import { IFileData } from '@renderer/store/reducers/workspace';

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

const MonacoEditor = () => {
  const { fileData, filePath } = useSelector<any, { fileData: IFileData[]; filePath: string }>((state) => state.workspace);
  const divEl = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  useEffect(() => {
    const language = filePath?.toLowerCase().endsWith('.json5') ? 'json5' : 'json';

    if (divEl.current) {
      // @ts-ignore
      editorRef.current = monaco.editor.create(divEl.current, {
        value: fileData?.[0]?.content,
        language,
        mouseWheelZoom: true,
        renderWhitespace: 'all',
      });
    }

    if (editorRef.current) {
      monaco.editor.setModelLanguage(editorRef.current.getModel()!, language);

      // TODO: update fileData
    }
    return () => {
      editorRef.current?.dispose();
      // @ts-ignore
      editorRef.current = null;
    };
  }, [fileData, filePath]);

  useEffect(() => {
    const onResize = () => {
      editorRef.current?.layout();
    };

    emitter.on('editor:resize', onResize);
    window.addEventListener('resize', onResize);

    return () => {
      emitter.off('editor:resize', onResize);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <div ref={divEl} style={{ width: '100%', height: '100%' }} />;
};

export default MonacoEditor;
