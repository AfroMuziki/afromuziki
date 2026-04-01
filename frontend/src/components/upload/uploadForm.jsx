// frontend/src/components/Upload/UploadForm.jsx

import React, { useState, useRef } from 'react';
import { useUpload } from '../../hooks/useUpload';
import UploadProgress from './UploadProgress';
import UploadStatus from './UploadStatus';
import { getFilePreview } from '../../utils/fileValidator';

const UploadForm = ({ token, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: ''
  });
  
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [errors, setErrors] = useState({});
  
  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
  const { uploadTrack, loading, progress, error, success, reset } = useUpload();
  
  const genres = [
    'Afrobeat', 'Afropop', 'Afrohouse', 'Amapiano', 
    'Bongo Flava', 'Coupe Decale', 'Genge', 'Highlife', 
    'Kuduro', 'Soukous', 'Other'
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleAudioSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setErrors(prev => ({ ...prev, audio: null }));
    }
  };
  
  const handleCoverSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const preview = await getFilePreview(file);
      setCoverPreview(preview);
      setErrors(prev => ({ ...prev, cover: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist name is required';
    }
    
    if (!audioFile) {
      newErrors.audio = 'Audio file is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await uploadTrack(formData, audioFile, coverFile, token);
      setFormData({ title: '', artist: '', genre: '' });
      setAudioFile(null);
      setCoverFile(null);
      setCoverPreview(null);
      
      if (audioInputRef.current) audioInputRef.current.value = '';
      if (coverInputRef.current) coverInputRef.current.value = '';
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Upload submission error:', err);
    }
  };
  
  const handleReset = () => {
    reset();
    setFormData({ title: '', artist: '', genre: '' });
    setAudioFile(null);
    setCoverFile(null);
    setCoverPreview(null);
    setErrors({});
    if (audioInputRef.current) audioInputRef.current.value = '';
    if (coverInputRef.current) coverInputRef.current.value = '';
  };
  
  return (
    <div className="upload-form-container">
      <h2>Upload New Track</h2>
      
      <UploadStatus 
        error={error} 
        success={success} 
        onReset={handleReset}
      />
      
      {!success && (
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="title">
              Track Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter track title"
              disabled={loading}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="artist">
              Artist Name *
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              placeholder="Enter artist name"
              disabled={loading}
              className={errors.artist ? 'error' : ''}
            />
            {errors.artist && <span className="error-message">{errors.artist}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="genre">
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">Select genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="audio">
              Audio File * (MP3, WAV, M4A - Max 50MB)
            </label>
            <input
              type="file"
              id="audio"
              ref={audioInputRef}
              accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a"
              onChange={handleAudioSelect}
              disabled={loading}
              className={errors.audio ? 'error' : ''}
            />
            {audioFile && (
              <div className="file-info">
                Selected: {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            )}
            {errors.audio && <span className="error-message">{errors.audio}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="cover">
              Cover Art (Optional - JPEG, PNG, WEBP - Max 5MB)
            </label>
            <input
              type="file"
              id="cover"
              ref={coverInputRef}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleCoverSelect}
              disabled={loading}
            />
            {coverPreview && (
              <div className="cover-preview">
                <img src={coverPreview} alt="Cover preview" />
              </div>
            )}
          </div>
          
          {loading && <UploadProgress progress={progress} />}
          
          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Uploading...' : 'Upload Track'}
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadForm;