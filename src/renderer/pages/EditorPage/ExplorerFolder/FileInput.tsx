import React, { useEffect, useRef } from 'react';

const FileInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const { defaultValue } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus();
    if (typeof defaultValue === 'string' && defaultValue) {
      inputRef.current.setSelectionRange(0, defaultValue.indexOf('.json') > -1 ? defaultValue.indexOf('.json') : defaultValue.length);
    }
  }, [defaultValue]);

  return <input ref={inputRef} spellCheck={false} {...props} />;
};

export default FileInput;
