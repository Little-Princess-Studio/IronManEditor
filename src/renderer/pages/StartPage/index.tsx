import './index.less';

const StartPage: React.FC = () => {
  const handleCreate = () => {
    // TODO:
  };

  const handleOpen = () => {
    // TODO:
  };

  return (
    <div className="start-page-container flex-center">
      <div className="start-page-section-wrap">
        <div className="start-page-section">
          <h3>启动</h3>
          <div className="start-btn" onClick={handleCreate}>
            新建文件...
          </div>
          <div className="start-btn" onClick={handleOpen}>
            打开文件...
          </div>
        </div>
        <div className="start-page-section">
          <h3>最近</h3>
          {/* TODO: */}
        </div>
      </div>
    </div>
  );
};

export default StartPage;
