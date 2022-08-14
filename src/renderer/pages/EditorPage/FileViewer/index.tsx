import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@renderer/store/configureStore';
import workfileMode from '@renderer/store/reducers/workfile';
import { useHotkeys } from 'react-hotkeys-hook';
import './index.less';

const FileViewer: React.FC = () => {
  const { events, path } = useSelector((state: RootState) => state.workfile);

  useHotkeys(
    'ctrl+r',
    () => {
      if (path) {
        window.electron.file
          .readFile(path)
          .then((resp) => {
            if (!resp.success) {
              throw resp;
            }

            workfileMode.updateWorkFile({ path, content: resp.data.content });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [path]
  );

  return (
    <div className="file-viewer-wrap">
      {events.map((evt, index) => (
        <div className="event-item-row" key={evt.name + index}>
          <span className="event-item-index">[{index + 1}]</span>
          <span className="event-item-name">[EVENT::{evt.name}]</span>
          <span className="flex-1">{evt.toString()}</span>
          <div className="event-item-actions">
            <i className="event-item-action action-edit" onClick={() => workfileMode.activateEvent(index)} />
            {/* <i className="event-item-action action-move" /> */}
            <i className="event-item-action action-delete" onClick={() => workfileMode.deleteEvent(index)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileViewer;
