import React from 'react';
import { Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white h-[60vh] flex items-center justify-center">
        <img src="https://picsum.photos/1600/900?grayscale" alt="Hero background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Nouvelle Collection</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">Découvrez les dernières tendances et sublimez votre style.</p>
          <Link to="/products" className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
            Découvrir
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Nos Catégories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link to={`/category/${category.toLowerCase()}`} key={category} className="relative rounded-lg overflow-hidden h-64 group">
                <img src={`https://picsum.photos/600/400?random=${index}`} alt={category} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-2xl font-semibold text-white">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Produits Phares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Inscrivez-vous à notre Newsletter</h2>
          <p className="mb-6 max-w-xl mx-auto">Recevez nos offres exclusives et soyez le premier au courant de nos nouveautés.</p>
          <form className="flex justify-center max-w-md mx-auto">
            <input type="email" placeholder="votre.email@example.com" className="w-full rounded-l-md px-4 py-3 text-primary bg-white focus:outline-none" />
            <button className="bg-primary hover:bg-gray-800 text-white font-semibold px-6 rounded-r-md transition-colors">S'inscrire</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;