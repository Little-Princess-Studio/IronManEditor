import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@renderer/store/configureStore';
import './index.less';

const FileViewer: React.FC = () => {
  const { path, content, events } = useSelector((state: RootState) => state.workfile);

  return (
    <div className="file-viewer-wrap">
      {events.map((evt, index) => (
        <div className="event-item-row" key={evt.name + index}>
          <span className="event-item-index">[{index + 1}]</span>
          <span className="flex-1">{evt.toString()}</span>
          <div className="event-item-actions">
            <i className="event-item-action action-edit" />
            <i className="event-item-action action-move" />
            <i className="event-item-action action-delete" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileViewer;
