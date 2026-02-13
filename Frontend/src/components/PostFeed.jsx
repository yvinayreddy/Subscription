import { useState, useEffect } from 'react';
import { postService, authService } from '../services';

/**
 * PostFeed Component
 * Displays all posts with pagination
 */
export const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const user = authService.getUser();

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const loadPosts = async (page) => {
    try {
      setLoading(true);
      const { data, pagination: paginationData } = await postService.getAll(page, 10);
      setPosts(data);
      setPagination(paginationData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeleting(postId);
      await postService.delete(postId);
      await loadPosts(currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading && posts.length === 0) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div>
          {posts.map(post => (
            <div
              key={post._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px'
              }}
            >
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  style={{ width: '100%', borderRadius: '4px', marginBottom: '10px' }}
                />
              )}
              {post.caption && <p>{post.caption}</p>}
              <small style={{ color: '#666' }}>
                {new Date(post.createdAt).toLocaleDateString()}
              </small>
              {user && user.id === post.user && (
                <button
                  onClick={() => handleDelete(post._id)}
                  disabled={deleting === post._id}
                  style={{
                    marginLeft: '10px',
                    padding: '6px 12px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {deleting === post._id ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          ))}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
