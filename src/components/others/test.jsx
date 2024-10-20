import React, { useState } from 'react';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select an image to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    fetch('https://api.imgur.com/3/image', {
      //mode: 'cors',
      method: 'POST',
      headers: {
        Authorization: 'Client-ID f260b84e886a6c3',
      },
      body: formData
    }).then(response => {
      console.log(response);
      if (response.ok) {
        alert('Image uploaded to album');       
      }
    }).catch(error => {
      console.error(error);
      alert('Upload failed: ' + error);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {imageUrl && <img src={imageUrl} alt="Uploaded Image" />}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ImageUploader;