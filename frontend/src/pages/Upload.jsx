// frontend/src/pages/Upload.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/Upload/UploadForm';

const Upload = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // Check authentication
  React.useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: '/upload' } });
    }
  }, [token, navigate]);
  
  if (!token) {
    return null;
  }
  
  const handleUploadSuccess = () => {
    // Navigate to tracks page or show success modal
    setTimeout(() => {
      navigate('/tracks');
    }, 2000);
  };
  
  return (
    <div className="upload-page">
      <div className="upload-header">
        <h1>Share Your Music</h1>
        <p>Upload your tracks and share them with the AfroMuziki community</p>
      </div>
      
      <UploadForm 
        token={token}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Upload;