
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist: React.FC = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Ma Liste d'envies</h1>
      {wishlistItems.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
          <p className="text-gray-600 text-xl mb-6">Votre liste d'envies est vide.</p>
          <Link to="/products" className="bg-accent text-white font-bold py-3 px-8 rounded-md hover:bg-accent-hover transition-colors">
            Découvrir des produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;