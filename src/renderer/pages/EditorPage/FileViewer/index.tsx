import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@renderer/store/configureStore';

const FileViewer: React.FC = () => {
  const { path, content } = useSelector((state: RootState) => state.workfile);

  // TODO:

  return <div>{content}</div>;
};

export default FileViewer;
