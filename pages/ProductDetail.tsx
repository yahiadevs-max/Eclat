import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0]);
  const [mainImage, setMainImage] = useState(product?.images[0]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Produit non trouvé</h2>
        <Link to="/products" className="mt-4 inline-block bg-accent text-white font-bold py-2 px-6 rounded hover:bg-accent-hover transition-colors">
          Retour aux produits
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, { size: selectedSize, color: selectedColor });
    // Maybe show a confirmation message
  };

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div>
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover object-center" />
            </div>
            <div className="flex space-x-2">
              {product.images.map((img, index) => (
                <button key={index} onMouseEnter={() => setMainImage(img)} className={`w-20 h-20 rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-accent' : 'border-transparent'}`}>
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category}{product.subcategory && ` - ${product.subcategory}`}</p>
            <h1 className="text-3xl font-bold text-primary mt-1">{product.name}</h1>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-3xl font-bold text-accent">{product.price.toFixed(2)} DA</p>
              <div className="flex items-center">
                <StarRating rating={product.rating} />
                <span className="ml-2 text-sm text-gray-600">({product.reviews} avis)</span>
              </div>
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>
            
            {product.colors && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Couleur</h3>
                <div className="flex items-center space-x-3 mt-2">
                  {product.colors.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`relative rounded-full flex items-center justify-center h-8 w-8 focus:outline-none ring-2 ring-offset-1 ${selectedColor === color ? 'ring-accent' : 'ring-transparent'}`} style={{ backgroundColor: color.toLowerCase() === 'blanc' ? '#FFF' : color, border: '1px solid #ccc' }}>
                      <span className="sr-only">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Taille</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-md text-sm font-medium ${selectedSize === size ? 'bg-primary text-secondary border-primary' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-lg">-</button>
                <span className="px-4 py-2">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-lg">+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded-md transition duration-300">
                Ajouter au panier
              </button>
            </div>
            <p className="mt-4 text-sm text-green-600">En stock: {product.stock} articles restants</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;