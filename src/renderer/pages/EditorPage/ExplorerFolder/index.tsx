import React, { useRef } from 'react';
import './index.less';

const ExplorerFolder: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSearch = (value?: string) => {
    value = value || inputRef.current?.value;

    // TODO: handle search file
    console.log('handle search file', value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // enter
    if (e.keyCode === 13) {
      e.preventDefault();
      // @ts-ignore
      onSearch(e.target.value);
    }
  };

  return (
    <div className="h-full explorer-folders-view">
      <div className="file-search-wrap">
        <input className="file-filter-input" placeholder="Search Script..." ref={inputRef} onKeyDown={onKeyDown} />
        <i className="file-filter-input-icon cursor-pointer" onClick={() => onSearch()} />
      </div>
    </div>
  );
};

export default ExplorerFolder;
