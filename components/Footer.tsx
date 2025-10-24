
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ÉCLAT</h3>
            <p className="text-sm text-gray-400">La mode qui vous ressemble.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-accent transition-colors">À propos</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Aide</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-2 text-gray-400">Restez informé des nouveautés et offres spéciales.</p>
            <form className="flex">
              <input type="email" placeholder="Votre email" className="w-full bg-white text-primary border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-500" />
              <button className="bg-accent text-white px-4 rounded-r-md text-sm font-semibold hover:bg-accent-hover transition-colors">S'inscrire</button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Éclat Commerce. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;