import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import EditorActions from './EditorActions';
import ExplorerFolder from './ExplorerFolder';
import FileViewer from './FileViewer';
import { RootState } from '@renderer/store/configureStore';
import workfileMode from '@renderer/store/reducers/workfile';
import EventDetailDrawer from '@renderer/components/EventDetailDrawer';
import { get } from 'lodash-es';
import './index.less';

const EditorPage: React.FC = () => {
  const { activeEventIndex, events } = useSelector((state: RootState) => state.workfile);

  return (
    <div className="full-screen editor-root">
      <div className="h-full flex-shrink-0 composite-bar">
        <EditorActions />
      </div>
      <div className="h-full flex-shrink-0">
        <ExplorerFolder />
      </div>
      <div className="h-full flex-grow overflow-y-auto">
        <FileViewer />
      </div>
      <EventDetailDrawer
        visible={activeEventIndex !== -1}
        event={get(events, activeEventIndex, null)}
        onClose={() => {
          workfileMode.activateEvent(-1);
        }}
        onSubmit={(values) => {
          workfileMode.updateEventData(values, activeEventIndex);
        }}
      />
    </div>
  );
};

export default EditorPage;
