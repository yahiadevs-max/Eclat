
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';
import { categories } from '../../data/products';

const ProductScraper: React.FC = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<Partial<Product> | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Access check
  if (user?.role !== 'superadmin' && !user?.permissions?.scraper) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
        <p className="text-gray-600 mt-2">Vous n'avez pas la permission d'importer des produits.</p>
      </div>
    );
  }
  
  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.startsWith('http')) {
      setError('Veuillez entrer une URL valide.');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);
    setScrapedData(null);

    // Simulate scraping delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock scraped data
    const mockData: Partial<Product> = {
      name: "Veste en Jean Vintage (Scraped)",
      brand: "Marque Inconnue",
      price: 89.99,
      description: "Une veste en jean classique avec une coupe vintage. Parfaite pour toutes les saisons. Tissu de haute qualité, confortable et durable. Cet article a été importé automatiquement.",
      images: ["https://picsum.photos/id/102/800/800", "https://picsum.photos/id/103/800/800", "https://picsum.photos/id/104/800/800"],
      category: "Hommes",
      stock: 25,
      sizes: ["M", "L", "XL"],
      colors: ["Bleu Délavé"]
    };

    setIsLoading(false);
    setScrapedData(mockData);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (scrapedData) {
      setScrapedData(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving scraped product:", scrapedData);
    // In a real app, this would be saved to the database.
    // For this demo, we'll just show a success message and clear the form.
    setSuccess(`Le produit "${scrapedData?.name}" a été ajouté à votre boutique !`);
    setScrapedData(null);
    setUrl('');
  };

  const inputStyles = "w-full p-2 border rounded bg-white text-primary border-gray-300 focus:ring-accent focus:border-accent";

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Importation de Produits par Scraping</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Étape 1 : Entrer l'URL du produit</h3>
        <form onSubmit={handleScrape} className="flex items-start space-x-4">
          <div className="flex-grow">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemple-boutique.com/produit/nom-du-produit"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-accent hover:bg-accent-hover text-white font-semibold py-2 px-6 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-wait"
          >
            {isLoading ? 'Importation...' : 'Importer'}
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyse de la page produit en cours...</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
          <p className="font-bold">Succès</p>
          <p>{success}</p>
        </div>
      )}

      {scrapedData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Étape 2 : Vérifier et sauvegarder les données</h3>
          <p className="text-sm text-gray-500 mb-6">Les données suivantes ont été extraites. Veuillez les vérifier, les compléter si nécessaire, et sauvegarder le produit.</p>
          
          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={scrapedData.name || ''} onChange={handleFormChange} placeholder="Nom du produit" className={inputStyles} required/>
                <input name="brand" value={scrapedData.brand || ''} onChange={handleFormChange} placeholder="Marque" className={inputStyles} required/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="price" type="number" step="0.01" value={scrapedData.price || ''} onChange={handleFormChange} placeholder="Prix" className={inputStyles} required/>
                <input name="stock" type="number" value={scrapedData.stock || ''} onChange={handleFormChange} placeholder="Stock" className={inputStyles} required/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="category" value={scrapedData.category || ''} onChange={handleFormChange} className={inputStyles}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input name="subcategory" value={scrapedData.subcategory || ''} onChange={handleFormChange} placeholder="Sous-catégorie (ex: T-shirts)" className={inputStyles} />
            </div>
            <textarea name="description" value={scrapedData.description || ''} onChange={handleFormChange} placeholder="Description" className={inputStyles} rows={4}></textarea>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Images (URLs)</label>
              {(scrapedData.images || []).map((imgUrl, index) => (
                <input 
                  key={index}
                  value={imgUrl}
                  onChange={(e) => {
                    const newImages = [...(scrapedData.images || [])];
                    newImages[index] = e.target.value;
                    setScrapedData(prev => ({ ...prev, images: newImages }));
                  }}
                  className={`${inputStyles} mb-2`}
                />
              ))}
            </div>
            <div className="flex gap-4">
              {(scrapedData.images || []).map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt={`Scraped image ${index + 1}`} className="w-24 h-24 object-cover rounded-md border" />
              ))}
            </div>
            
            <input name="sizes" value={(scrapedData.sizes || []).join(', ')} onChange={e => setScrapedData(prev => ({...prev, sizes: e.target.value.split(',').map(s => s.trim())}))} placeholder="Tailles (séparées par des virgules)" className={inputStyles} />
            <input name="colors" value={(scrapedData.colors || []).join(', ')} onChange={e => setScrapedData(prev => ({...prev, colors: e.target.value.split(',').map(s => s.trim())}))} placeholder="Couleurs (séparées par des virgules)" className={inputStyles} />

            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={() => setScrapedData(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
              <button type="submit" className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Sauvegarder le Produit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductScraper;
