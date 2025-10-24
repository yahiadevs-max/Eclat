import React from 'react';
import { products as initialProducts, categories } from '../../data/products';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';

const ManageProducts: React.FC = () => {
  const { user } = useAuth();
  const [productList, setProductList] = React.useState<Product[]>(initialProducts);
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);

  if (user?.role !== 'superadmin' && !user?.permissions?.products) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
            <p className="text-gray-600 mt-2">Vous n'avez pas la permission de gérer les produits.</p>
        </div>
    );
  }

  const openFormModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingProduct(null);
  };
  
  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
  };

  const handleSave = (productData: Product) => {
    if (editingProduct) {
      setProductList(productList.map(p => p.id === productData.id ? productData : p));
    } else {
      const newProduct = { ...productData, id: Date.now() }; // Simple ID generation
      setProductList([newProduct, ...productList]);
    }
    closeFormModal();
  };

  const handleDelete = (productId: number) => {
    setProductList(productList.filter(p => p.id !== productId));
    closeDeleteModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Gestion des Produits</h2>
        <button onClick={() => openFormModal()} className="bg-accent hover:bg-accent-hover text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">
          Ajouter un Produit
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productList.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}{product.subcategory ? ` > ${product.subcategory}` : ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price.toFixed(2)} DA</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => openFormModal(product)} className="text-accent hover:text-accent-hover">Modifier</button>
                    <button onClick={() => openDeleteModal(product)} className="text-red-600 hover:text-red-800">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isFormModalOpen && <ProductFormModal product={editingProduct} onSave={handleSave} onClose={closeFormModal} />}
      {productToDelete && <ConfirmationModal product={productToDelete} onConfirm={handleDelete} onCancel={closeDeleteModal} />}
    </div>
  );
};

// Modal Form Component
const ProductFormModal: React.FC<{ product: Product | null, onSave: (product: Product) => void, onClose: () => void }> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = React.useState({
    name: product?.name || '',
    brand: product?.brand || '',
    price: product?.price || 0,
    category: product?.category || categories[0],
    subcategory: product?.subcategory || '',
    images: product?.images || [],
    description: product?.description || '',
    stock: product?.stock || 0,
    sizes: product?.sizes || [],
    colors: product?.colors || [],
  });
  const inputStyles = "w-full p-2 border rounded bg-white text-primary border-gray-300 focus:ring-accent focus:border-accent";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: product?.id || 0, rating: product?.rating || 0, reviews: product?.reviews || 0 });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Modifier le Produit' : 'Ajouter un Produit'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom du produit" className={inputStyles} required/>
                <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Marque" className={inputStyles} required/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Prix" className={inputStyles} required/>
                <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" className={inputStyles} required/>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="category" value={formData.category} onChange={handleChange} className={inputStyles}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input name="subcategory" value={formData.subcategory} onChange={handleChange} placeholder="Sous-catégorie (ex: T-shirts)" className={inputStyles} />
            </div>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className={inputStyles} rows={4}></textarea>
             <input name="images" value={formData.images.join(', ')} onChange={e => setFormData(prev => ({...prev, images: e.target.value.split(',').map(s => s.trim())}))} placeholder="Images (URLs séparées par des virgules)" className={inputStyles} />
             <input name="sizes" value={formData.sizes?.join(', ')} onChange={e => setFormData(prev => ({...prev, sizes: e.target.value.split(',').map(s => s.trim())}))} placeholder="Tailles (séparées par des virgules)" className={inputStyles} />
             <input name="colors" value={formData.colors?.join(', ')} onChange={e => setFormData(prev => ({...prev, colors: e.target.value.split(',').map(s => s.trim())}))} placeholder="Couleurs (séparées par des virgules)" className={inputStyles} />

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal: React.FC<{ product: Product, onConfirm: (id: number) => void, onCancel: () => void }> = ({ product, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le produit : <span className="font-semibold">{product.name}</span> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Annuler
          </button>
          <button onClick={() => onConfirm(product.id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Confirmer la suppression
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;