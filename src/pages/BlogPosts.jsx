import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch posts from backend
    const fetchPosts = async () => {
      try {
        // const response = await fetch('/api/posts');
        // const data = await response.json();
        // setPosts(data);
        setPosts([
          {
            id: 1,
            title: 'Sample Post 1',
            content: 'This is a sample blog post content...',
            author: 'John Doe',
            date: '2024-04-26'
          },
          {
            id: 2,
            title: 'Sample Post 2',
            content: 'Another sample blog post content...',
            author: 'Jane Smith',
            date: '2024-04-25'
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Blog Posts
          </h1>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {post.title}
                </h2>
                <p className="mt-2 text-gray-600 line-clamp-3">
                  {post.content}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">
                      <p>By {post.author}</p>
                      <p>{new Date(post.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPosts; 