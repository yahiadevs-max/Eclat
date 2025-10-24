
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const Category: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  
  const categoryProducts = products.filter(
    p => p.category.toLowerCase() === categoryName?.toLowerCase()
  );
  
  const capitalizedCategory = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          <Link to="/" className="hover:underline">Accueil</Link> / <span>{capitalizedCategory}</span>
        </p>
      </div>
      <h1 className="text-4xl font-bold text-center mb-8">{capitalizedCategory}</h1>
      
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Aucun produit trouvé dans cette catégorie.</p>
          <Link to="/products" className="mt-4 inline-block bg-accent text-white font-bold py-2 px-6 rounded hover:bg-blue-600 transition-colors">
            Voir tous les produits
          </Link>
        </div>
      )}
    </div>
  );
};

export default Category;
