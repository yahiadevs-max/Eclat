import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminPermissions } from '../../context/AuthContext';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'superadmin' | 'admin';
  permissions?: AdminPermissions;
}

const initialAdmins: AdminUser[] = [
  { id: 1, username: 'yahia', email: 'yahia.admin@eclat.com', role: 'superadmin' },
  { 
    id: 2, 
    username: 'admin', 
    email: 'admin.user@eclat.com', 
    role: 'admin', 
    permissions: {
      products: true,
      orders: true,
      stock: false,
      deliveries: false,
      payments: false,
      returns: false,
      shipping: true,
    }
  },
];

const permissionLabels: { [key in keyof AdminPermissions]: string } = {
  products: "Produits",
  orders: "Commandes",
  stock: "Stock",
  deliveries: "Livraisons",
  shipping: "Frais de Port",
  payments: "Paiements",
  returns: "Retours",
};

const ManageAdmins: React.FC = () => {
  const { user } = useAuth();

  // Access check right at the start
  if (user?.role !== 'superadmin') {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
            <p className="text-gray-600 mt-2">Seuls les super administrateurs peuvent gérer les comptes administrateurs.</p>
        </div>
    );
  }

  // All state and logic is for the super admin view.
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // State for the creation form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin'>('admin');
  const [permissions, setPermissions] = useState<AdminPermissions>({
    products: false, orders: false, stock: false, deliveries: false, payments: false, returns: false, shipping: false,
  });

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPermissions(prev => ({ ...prev, [name]: checked }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmin: AdminUser = { 
      id: Date.now(), 
      username, 
      email, 
      role, 
      permissions: role === 'admin' ? permissions : undefined 
    };
    setAdmins(prev => [...prev, newAdmin]);
    alert(`Admin '${username}' (${email}) créé avec le rôle: ${role}`);
    // Reset form
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('admin');
    setPermissions({ products: false, orders: false, stock: false, deliveries: false, payments: false, returns: false, shipping: false });
  };

  const handleDelete = (adminToDelete: AdminUser) => {
    if (adminToDelete.role === 'superadmin') {
      alert("Un compte Super Administrateur ne peut pas être supprimé.");
      return;
    }
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'administrateur ${adminToDelete.username} ?`)) {
      setAdmins(prev => prev.filter(admin => admin.id !== adminToDelete.id));
    }
  };

  const openEditModal = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedAdmin: AdminUser) => {
    setAdmins(prev => prev.map(admin => admin.id === updatedAdmin.id ? updatedAdmin : admin));
    setIsEditModalOpen(false);
  };

  const inputStyles = "w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent bg-white text-primary";


  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Gestion des Administrateurs</h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Create Admin Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md self-start">
          <h3 className="text-xl font-semibold mb-6">Créer un nouvel administrateur</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputStyles} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputStyles} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputStyles} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle</label>
              <select value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'superadmin')} className={inputStyles}>
                <option value="admin">Administrateur</option>
                <option value="superadmin">Super Administrateur</option>
              </select>
            </div>
            {role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(permissionLabels).map(key => (
                    <label key={key} className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" name={key} checked={permissions[key as keyof AdminPermissions]} onChange={handlePermissionChange} className="rounded text-accent focus:ring-accent" />
                      <span>{permissionLabels[key as keyof AdminPermissions]}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-accent rounded-md hover:bg-accent-hover">
              Créer le compte
            </button>
          </form>
        </div>

        {/* List of Admins */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-6">Administrateurs existants</h3>
            <ul className="divide-y divide-gray-200">
                {admins.map(admin => (
                    <li key={admin.id} className="py-4 flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{admin.username}</p>
                            <p className="text-sm text-gray-500">{admin.email}</p>
                            <p className={`text-xs mt-1 font-semibold ${admin.role === 'superadmin' ? 'text-accent' : 'text-gray-400'}`}>
                                {admin.role === 'superadmin' ? 'Super Administrateur' : 'Administrateur'}
                            </p>
                             {admin.role === 'admin' && (
                                <p className="text-xs text-gray-500 mt-1">
                                    <strong>Permissions:</strong> {Object.entries(admin.permissions || {}).filter(([, value]) => value).map(([key]) => permissionLabels[key as keyof AdminPermissions]).join(', ') || 'Aucune'}
                                </p>
                            )}
                        </div>
                        <div className="space-x-4">
                            <button onClick={() => openEditModal(admin)} className="text-sm text-accent hover:underline">Modifier</button>
                            <button onClick={() => handleDelete(admin)} className="text-sm text-red-600 hover:text-red-800">Supprimer</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </div>
      {isEditModalOpen && editingAdmin && (
          <EditAdminModal admin={editingAdmin} onSave={handleEditSave} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
}

// Edit Admin Modal Component
const EditAdminModal: React.FC<{ admin: AdminUser, onSave: (admin: AdminUser) => void, onClose: () => void }> = ({ admin, onSave, onClose }) => {
    const [formData, setFormData] = useState<AdminUser>(admin);
    const inputStyles = "w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent bg-white text-primary";


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            permissions: { ...prev.permissions, [name]: checked } as AdminPermissions
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-6">Modifier l'Administrateur</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rôle</label>
                        <select name="role" value={formData.role} onChange={handleChange} disabled={formData.username === 'yahia'} className={`${inputStyles} disabled:bg-gray-100`}>
                            <option value="admin">Administrateur</option>
                            <option value="superadmin">Super Administrateur</option>
                        </select>
                        {formData.username === 'yahia' && <p className="text-xs text-gray-500 mt-1">Le rôle du super administrateur principal ne peut pas être modifié.</p>}
                    </div>
                     {formData.role === 'admin' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                            <div className="grid grid-cols-2 gap-2">
                            {Object.keys(permissionLabels).map(key => (
                                <label key={key} className="flex items-center space-x-2 text-sm">
                                <input type="checkbox" name={key} checked={formData.permissions?.[key as keyof AdminPermissions]} onChange={handlePermissionChange} className="rounded text-accent focus:ring-accent" />
                                <span>{permissionLabels[key as keyof AdminPermissions]}</span>
                                </label>
                            ))}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageAdmins;