import './App.css'
import { useState } from "react";
import axios from "axios";

const App = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) return setError("Please select an image first");

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const { data } = await axios.post(
        `${API_URL}/remove-bg`, 
        formData, 
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: 'blob'
        }
      );
      setResult(URL.createObjectURL(new Blob([data])));
    } catch (err) {
      setError("Failed to remove background. Please try again.");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = 'removed-background.png';
    link.click();
  };

  return (
    <div className="container">
      <h1>Background Remover</h1>
      
      <div className="upload-section">
        <input 
          type="file" 
          onChange={handleImageUpload} 
          accept="image/*"
          className="file-input" 
        />
        <button 
          onClick={handleSubmit} 
          disabled={!image || loading}
          className="button"
        >
          {loading ? 'Processing...' : 'Remove Background'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      
      {result && (
      <div>
        <div className="result-section">
          <img src={result} alt="Background Removed" className="result-image" />
        </div>
        <button onClick={handleDownload} className="button download-button">
            Download Image
          </button>
      </div>
        
      )}
    </div>
  );
};

export default App;
