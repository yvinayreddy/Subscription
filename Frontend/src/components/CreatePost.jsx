import { useState } from 'react';
import { postService, authService } from '../services';

/**
 * CreatePost Component
 * Allows users to create new posts with image
 */
export const CreatePost = ({ onPostCreated }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = authService.getUser();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login to create a post');
      return;
    }

    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      setLoading(true);
      await postService.create(caption, image);
      setCaption('');
      setImage(null);
      setPreview('');
      onPostCreated?.();
      alert('Post created successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please login to create a post</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '500px',
        margin: '0 auto 30px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px'
      }}
    >
      <h3>Create a Post</h3>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <textarea
        placeholder="What's on your mind?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows="4"
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontFamily: 'inherit'
        }}
      />

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginRight: '10px' }}
          />
          Choose Image
        </label>
        {preview && (
          <div style={{ marginTop: '10px', position: 'relative' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '4px',
                maxHeight: '300px'
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              style={{
                marginTop: '10px',
                padding: '6px 12px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Remove Image
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
};
