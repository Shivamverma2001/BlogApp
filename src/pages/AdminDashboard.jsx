import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaEye, FaSpinner, FaTimes, FaCalendar } from 'react-icons/fa';
import CreatePost from '../components/CreatePost';
import { postService, authService } from '../services/api';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts();
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again later.');
      setPosts([]);
      setLoading(false);
    }
  };

  const handleCreatePost = async (formData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const newPost = await postService.createPost(formData);
      setPosts(prev => [newPost, ...prev]);
      setSuccessMessage('Post created successfully!');
      setShowCreatePost(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      setSuccessMessage('Post deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post. Please try again.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-gray-600">Manage your blog posts and content</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <FaEye className="mr-2" />
              View Blog
            </button>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              New Post
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {showCreatePost ? (
          <CreatePost 
            onSubmit={handleCreatePost}
            isSubmitting={isSubmitting}
            onCancel={() => setShowCreatePost(false)}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {post.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <FaCalendar className="mr-2" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors p-2"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No posts found. Create your first post by clicking the "New Post" button.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 