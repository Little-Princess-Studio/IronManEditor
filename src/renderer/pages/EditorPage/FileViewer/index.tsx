import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@renderer/store/configureStore';
import { activateEvent, deleteEvent } from '@renderer/store/reducers/workfile';
import './index.less';

const FileViewer: React.FC = () => {
  const { events } = useSelector((state: RootState) => state.workfile);
  const dispatch = useDispatch();

  return (
    <div className="file-viewer-wrap">
      {events.map((evt, index) => (
        <div className="event-item-row" key={evt.name + index}>
          <span className="event-item-index">[{index + 1}]</span>
          <span className="flex-1">{evt.toString()}</span>
          <div className="event-item-actions">
            <i className="event-item-action action-edit" onClick={() => dispatch(activateEvent(index))} />
            {/* <i className="event-item-action action-move" /> */}
            <i className="event-item-action action-delete" onClick={() => dispatch(deleteEvent(index))} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileViewer;
