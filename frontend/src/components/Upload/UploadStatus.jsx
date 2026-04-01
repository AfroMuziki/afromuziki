// frontend/src/components/Upload/UploadStatus.jsx

import React from 'react';

const UploadStatus = ({ error, success, onReset }) => {
  if (error) {
    return (
      <div className="upload-status error">
        <div className="upload-status-icon">!</div>
        <div className="upload-status-content">
          <h4>Upload Failed</h4>
          <p>{error}</p>
          {onReset && (
            <button onClick={onReset} className="upload-status-button">
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="upload-status success">
        <div className="upload-status-icon">✓</div>
        <div className="upload-status-content">
          <h4>Upload Successful</h4>
          <p>{success.message}</p>
          {onReset && (
            <button onClick={onReset} className="upload-status-button">
              Upload Another Track
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return null;
};

export default UploadStatus;
