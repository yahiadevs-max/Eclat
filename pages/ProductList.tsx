import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ChevronDownIcon } from '../components/icons';

const TOP_BRAND_COUNT = 4; // Number of top brands to show individually
const LOCAL_STORAGE_KEY = 'eclatCommerceFilters';

// FIX: Completed the ProductList component with a return statement and default export.
const ProductList: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q')?.toLowerCase() || '';

  const initialFilters = {
    category: 'all',
    subcategory: [] as string[],
    price: { min: '', max: '' },
    brand: [] as string[],
  };

  // Function to get initial state from localStorage or defaults
  const getInitialState = () => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Basic validation to ensure the parsed object has the expected keys.
        if (parsedState.filters && parsedState.sortBy) {
          // Ensure nested properties exist to avoid runtime errors
          parsedState.filters.category = parsedState.filters.category || 'all';
          parsedState.filters.subcategory = parsedState.filters.subcategory || [];
          parsedState.filters.price = parsedState.filters.price || { min: '', max: '' };
          parsedState.filters.brand = parsedState.filters.brand || [];
          return { filters: parsedState.filters, sortBy: parsedState.sortBy };
        }
      }
    } catch (error) {
      console.error("Failed to parse filters from localStorage", error);
    }
    return { filters: initialFilters, sortBy: 'relevance' };
  };

  const initialState = getInitialState();

  const [appliedFilters, setAppliedFilters] = useState(initialState.filters);
  const [pendingFilters, setPendingFilters] = useState(initialState.filters);
  const [sortBy, setSortBy] = useState(initialState.sortBy);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Effect to save filters to localStorage whenever they are applied or sorted
  useEffect(() => {
    try {
      const stateToSave = {
        filters: appliedFilters,
        sortBy: sortBy,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save filters to localStorage", error);
    }
  }, [appliedFilters, sortBy]);

  const { topBrands } = useMemo(() => {
    const brandCounts = products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedBrands = Object.keys(brandCounts).sort((a, b) => brandCounts[b] - brandCounts[a]);
    
    return {
      topBrands: sortedBrands.slice(0, TOP_BRAND_COUNT),
    };
  }, []);

  const availableSubcategories = useMemo(() => {
    if (pendingFilters.category === 'all') {
      return [];
    }
    const subcategoriesForCategory = products
      .filter(p => p.category === pendingFilters.category && p.subcategory)
      .map(p => p.subcategory!);
    return [...new Set(subcategoriesForCategory)];
  }, [pendingFilters.category]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (query) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    if (appliedFilters.category !== 'all') {
      result = result.filter(product => product.category === appliedFilters.category);
    }

    if (appliedFilters.subcategory.length > 0) {
      result = result.filter(product => product.subcategory && appliedFilters.subcategory.includes(product.subcategory));
    }

    if (appliedFilters.brand.length > 0) {
      const otherBrandsSelected = appliedFilters.brand.includes('Autres');
      const selectedTopBrands = appliedFilters.brand.filter(b => b !== 'Autres');

      result = result.filter(product => {
        const isSelectedTopBrand = selectedTopBrands.includes(product.brand);
        const isOtherBrand = otherBrandsSelected && !topBrands.includes(product.brand);
        return isSelectedTopBrand || isOtherBrand;
      });
    }
    
    const minPrice = parseFloat(appliedFilters.price.min);
    const maxPrice = parseFloat(appliedFilters.price.max);
    if (!isNaN(minPrice)) {
      result = result.filter(product => product.price >= minPrice);
    }
    if (!isNaN(maxPrice)) {
        result = result.filter(product => product.price <= maxPrice);
    }

    const sortedResult = [...result];
    switch (sortBy) {
      case 'price-asc':
        sortedResult.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedResult.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sortedResult.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        sortedResult.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return sortedResult;
  }, [query, appliedFilters, sortBy, topBrands]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    setPendingFilters(prev => {
      switch (name) {
        case 'category':
          return { ...prev, category: value, subcategory: [] };
        case 'subcategory':
          return {
            ...prev,
            subcategory: checked
              ? [...prev.subcategory, value]
              : prev.subcategory.filter(sc => sc !== value),
          };
        case 'brand':
          return {
            ...prev,
            brand: checked
              ? [...prev.brand, value]
              : prev.brand.filter(b => b !== value),
          };
        case 'min-price':
          return { ...prev, price: { ...prev.price, min: value } };
        case 'max-price':
          return { ...prev, price: { ...prev.price, max: value } };
        default:
          return prev;
      }
    });
  };

  const applyFilters = () => {
    setAppliedFilters(pendingFilters);
    if (showMobileFilters) {
      setShowMobileFilters(false);
    }
  };

  const resetFilters = () => {
    setPendingFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSortBy('relevance');
    // The useEffect will automatically update localStorage with the reset state
  };

  const FilterContent: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
    <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h3 className="font-semibold mb-3 border-b pb-2">Catégorie</h3>
          <div className="space-y-2">
             <div className="flex items-center">
                <input type="radio" id={`cat-all-${isMobile}`} name="category" value="all" checked={pendingFilters.category === 'all'} onChange={handleFilterChange} className="h-4 w-4 text-accent border-gray-300 focus:ring-accent" />
                <label htmlFor={`cat-all-${isMobile}`} className="ml-3 text-sm text-gray-600">Toutes</label>
            </div>
            {categories.map(cat => (
              <div key={cat} className="flex items-center">
                <input type="radio" id={`${cat}-${isMobile}`} name="category" value={cat} checked={pendingFilters.category === cat} onChange={handleFilterChange} className="h-4 w-4 text-accent border-gray-300 focus:ring-accent" />
                <label htmlFor={`${cat}-${isMobile}`} className="ml-3 text-sm text-gray-600">{cat}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Subcategory Filter */}
        {availableSubcategories.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 border-b pb-2">Sous-catégorie</h3>
            <div className="space-y-2">
              {availableSubcategories.map(subcat => (
                <div key={subcat} className="flex items-center">
                  <input type="checkbox" id={`${subcat}-${isMobile}`} name="subcategory" value={subcat} checked={pendingFilters.subcategory.includes(subcat)} onChange={handleFilterChange} className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent" />
                  <label htmlFor={`${subcat}-${isMobile}`} className="ml-3 text-sm text-gray-600">{subcat}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Price Filter */}
        <div>
          <h3 className="font-semibold mb-3 border-b pb-2">Prix (DA)</h3>
          <div className="flex items-center space-x-2">
            <input type="number" name="min-price" value={pendingFilters.price.min} onChange={handleFilterChange} placeholder="Min" className="w-full p-2 border rounded-md bg-white text-primary text-sm" />
            <span className="text-gray-500">-</span>
            <input type="number" name="max-price" value={pendingFilters.price.max} onChange={handleFilterChange} placeholder="Max" className="w-full p-2 border rounded-md bg-white text-primary text-sm" />
          </div>
        </div>

        {/* Brand Filter */}
        <div>
          <h3 className="font-semibold mb-3 border-b pb-2">Marque</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {topBrands.map(brand => (
              <div key={brand} className="flex items-center">
                <input type="checkbox" id={`${brand}-${isMobile}`} name="brand" value={brand} checked={pendingFilters.brand.includes(brand)} onChange={handleFilterChange} className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent" />
                <label htmlFor={`${brand}-${isMobile}`} className="ml-3 text-sm text-gray-600">{brand}</label>
              </div>
            ))}
            <div className="flex items-center">
                <input type="checkbox" id={`Autres-${isMobile}`} name="brand" value="Autres" checked={pendingFilters.brand.includes('Autres')} onChange={handleFilterChange} className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent" />
                <label htmlFor={`Autres-${isMobile}`} className="ml-3 text-sm text-gray-600">Autres</label>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t">
            <button onClick={applyFilters} className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">
                Appliquer les filtres
            </button>
            <button onClick={resetFilters} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md text-sm transition-colors">
                Réinitialiser
            </button>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Filtres</h2>
            <FilterContent />
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b">
            <h1 className="text-2xl font-bold text-primary mb-4 sm:mb-0">
              {query ? `Résultats pour "${query}"` : 'Tous les produits'} ({filteredProducts.length})
            </h1>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowMobileFilters(true)} className="lg:hidden bg-white border rounded-md px-4 py-2 text-sm font-medium flex items-center">
                Filtres
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="price-asc">Prix: Croissant</option>
                  <option value="price-desc">Prix: Décroissant</option>
                  <option value="rating-desc">Mieux notés</option>
                  <option value="name-asc">Nom: A-Z</option>
                </select>
                <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Aucun produit ne correspond à votre recherche.</p>
              <button onClick={resetFilters} className="mt-4 bg-accent text-white font-bold py-2 px-6 rounded hover:bg-accent-hover transition-colors">
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-secondary p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filtres</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-2xl font-bold">&times;</button>
            </div>
            <FilterContent isMobile />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
