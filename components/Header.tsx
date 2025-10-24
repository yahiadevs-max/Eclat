import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, UserIcon, SearchIcon, MicrophoneIcon, SparkleIcon } from './icons';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

// Add SpeechRecognition types for window object
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Header: React.FC = () => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        if (transcript.trim()) {
          navigate(`/products?q=${encodeURIComponent(transcript.trim())}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported by this browser.");
    }
  }, [navigate]);
  
  const activeLinkStyle = {
    color: '#38b2ac', // accent color
    fontWeight: '600',
  };

  const accountLink = isAuthenticated ? '/admin/dashboard' : '/admin/login';
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleVoiceSearch = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Could not start speech recognition:", error);
      }
    } else if (!recognitionRef.current) {
      alert("La recherche vocale n'est pas supportée par votre navigateur.");
    }
  };

  return (
    <header className="bg-primary text-secondary shadow-md sticky top-0 z-50">
      {/* Top tier: Logo, Search, Actions */}
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2 text-secondary hover:text-gray-300 transition-colors">
            <span className="text-2xl font-bold tracking-wider">ÉCLAT</span>
            <SparkleIcon className="w-5 h-5 text-accent" />
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center px-8">
             <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={isListening ? "Veuillez parler..." : "Rechercher un produit..."}
                    className="w-full bg-white text-primary rounded-full py-2 pl-5 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                 <button 
                    type="button" 
                    onClick={handleVoiceSearch}
                    title="Recherche vocale"
                    className="absolute right-10 top-1/2 -translate-y-1/2 mr-1 text-gray-500 hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isListening}
                >
                    <MicrophoneIcon className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                </button>
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 mr-3 text-gray-500 hover:text-accent">
                    <SearchIcon className="w-5 h-5" />
                </button>
            </form>
        </div>

        <div className="flex-shrink-0 flex items-center justify-end space-x-4 sm:space-x-6">
          <NavLink to="/about" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-sm hover:text-accent transition-colors">À Propos</NavLink>
          <NavLink to="/blog" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-sm hover:text-accent transition-colors">Blog</NavLink>
          <NavLink to="/contact" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-sm hover:text-accent transition-colors">Contact</NavLink>

          <div className="h-6 w-px bg-gray-600"></div>

          <Link to={accountLink} className="hover:text-accent transition-colors" title={isAuthenticated ? "Tableau de Bord Admin" : "Connexion"}>
            <UserIcon className="w-6 h-6" />
          </Link>
          <Link to="/wishlist" className="relative hover:text-accent transition-colors">
            <HeartIcon className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative hover:text-accent transition-colors">
            <ShoppingCartIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Bottom tier: Navigation Links */}
      <nav className="bg-white text-primary shadow-inner">
        <div className="container mx-auto px-4 h-12 flex justify-center items-center space-x-8 text-sm font-medium">
          <NavLink to="/" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="hover:text-accent transition-colors">Accueil</NavLink>
          <NavLink to="/category/hommes" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="hover:text-accent transition-colors">Hommes</NavLink>
          <NavLink to="/category/femmes" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="hover:text-accent transition-colors">Femmes</NavLink>
          <NavLink to="/category/accessoires" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="hover:text-accent transition-colors">Accessoires</NavLink>
          <NavLink to="/category/soins & beauté" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="hover:text-accent transition-colors">Soins & Beauté</NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;