import React from 'react';
import { Link } from 'react-router-dom';
import { mockBlogPosts } from '../data/blogPosts';

const Blog: React.FC = () => {
  return (
    <div className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Notre Blog</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Conseils de style, tendances, et coulisses de la création chez Éclat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group">
              <Link to="#" className="block overflow-hidden">
                <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
              </Link>
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                  <Link to="#">{post.title}</Link>
                </h2>
                <div className="text-sm text-gray-500 mb-4">
                  <span>Par {post.author}</span> &bull; <span>{post.date}</span>
                </div>
                <p className="text-gray-700 leading-relaxed flex-grow">{post.excerpt}</p>
                <div className="mt-6">
                   <Link to="#" className="font-semibold text-accent hover:text-accent-hover transition-colors">
                    Lire la suite &rarr;
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

export default Blog;