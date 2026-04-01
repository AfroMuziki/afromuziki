// frontend/src/components/Upload/UploadProgress.jsx

import React from 'react';

const UploadProgress = ({ progress }) => {
  return (
    <div className="upload-progress">
      <div className="upload-progress-bar-container">
        <div 
          className="upload-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="upload-progress-text">
        {progress < 100 ? `Uploading: ${progress}%` : 'Upload complete'}
      </div>
    </div>
  );
};

export default UploadProgress;
