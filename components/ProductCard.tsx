import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { HeartIcon } from './icons';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleAddToCart = () => {
    const options = {
      size: product.sizes?.[0],
      color: product.colors?.[0],
    };
    addToCart(product, quantity, options);
  };

  return (
    <div className="group relative border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col bg-white">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="hover:text-accent transition-colors">
            <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
        {product.subcategory && <p className="text-xs text-gray-400">{product.subcategory}</p>}
        
        <div className="mt-2 flex items-center">
            <StarRating rating={product.rating} />
            <span className="ml-2 text-xs text-gray-500">({product.reviews} avis)</span>
        </div>
        
        <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-semibold text-gray-900">{product.price.toFixed(2)} DA</p>
            <p className="text-xs text-gray-500">
              {product.stock > 0 ? `En stock: ${product.stock}` : <span className="text-red-600 font-semibold">Rupture</span>}
            </p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))} 
              className="px-2 py-1 border rounded-l-md text-sm hover:bg-gray-100 disabled:opacity-50"
              disabled={quantity <= 1}
              aria-label="Diminuer la quantité"
            >
              -
            </button>
            <span className="px-3 py-1 border-t border-b text-sm font-medium">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
              className="px-2 py-1 border rounded-r-md text-sm hover:bg-gray-100 disabled:opacity-50"
              disabled={quantity >= product.stock || product.stock === 0}
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-primary text-secondary text-xs font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Ajouter
          </button>
        </div>
      </div>
      
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-red-500 transition-all duration-300"
        aria-label="Ajouter à la wishlist"
      >
        <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
      </button>
    </div>
  );
};

export default ProductCard;