import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { wilayas, shippingCosts } from '../data/shipping';

const Checkout: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [shippingCost, setShippingCost] = useState(0);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    country: 'Algérie',
    city: '',
    commune: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'livraison' | 'cib' | 'dahabia'>('livraison');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    if (id === 'city') {
        const cost = shippingCosts[value] || 0;
        setShippingCost(cost);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle form validation and payment processing.
    // For this demo, we'll just log the data, clear the cart, and redirect.
    console.log({
      customerDetails: formData,
      paymentMethod,
      orderItems: cartItems,
      shippingCost,
      total: cartTotal + shippingCost,
    });
    clearCart();
    navigate('/confirmation');
  };

  const showPaymentForm = paymentMethod === 'cib' || paymentMethod === 'dahabia';

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Paiement</h1>
        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Details */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Vos Coordonnées</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Prénom</label>
                <input type="text" id="firstname" value={formData.firstname} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-primary" required />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Nom</label>
                <input type="text" id="lastname" value={formData.lastname} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-primary" required />
              </div>
               <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-primary" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse Email</label>
                <input type="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-primary" required />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mt-10 mb-6 border-b pb-4">Adresse de livraison</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Pays</label>
                    <input type="text" id="country" value={formData.country} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 text-primary" readOnly />
                </div>
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville (Wilaya)</label>
                    <select id="city" value={formData.city} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-primary" required>
                        <option value="" disabled>Sélectionnez votre wilaya</option>
                        {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="commune" className="block text-sm font-medium text-gray-700">Commune</label>
                    <input type="text" id="commune" value={formData.commune} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-primary" required />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse de la maison</label>
                    <input type="text" id="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-primary" required />
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-10 mb-6 border-b pb-4">Méthode de Paiement</h2>
            <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-accent transition-colors">
                    <input id="livraison" name="paymentMethod" type="radio" value="livraison" checked={paymentMethod === 'livraison'} onChange={() => setPaymentMethod('livraison')} className="h-4 w-4 text-accent border-gray-300 focus:ring-accent" />
                    <label htmlFor="livraison" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer">Paiement à la livraison</label>
                </div>
                 <div className="flex items-center p-4 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-accent transition-colors">
                    <input id="cib" name="paymentMethod" type="radio" value="cib" checked={paymentMethod === 'cib'} onChange={() => setPaymentMethod('cib')} className="h-4 w-4 text-accent border-gray-300 focus:ring-accent" />
                    <label htmlFor="cib" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer">Paiement par CIB</label>
                </div>
                 <div className="flex items-center p-4 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-accent transition-colors">
                    <input id="dahabia" name="paymentMethod" type="radio" value="dahabia" checked={paymentMethod === 'dahabia'} onChange={() => setPaymentMethod('dahabia')} className="h-4 w-4 text-accent border-gray-300 focus:ring-accent" />
                    <label htmlFor="dahabia" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer">Paiement par Dahabia</label>
                </div>
            </div>

            {showPaymentForm && (
                <div className="mt-8 border-t pt-6">
                     <h3 className="text-xl font-semibold mb-4">Informations de paiement</h3>
                     <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Numéro de carte</label>
                        <input type="text" id="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="•••• •••• •••• ••••" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-primary" required={showPaymentForm} />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-4">
                        <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Date d'expiration</label>
                            <input type="text" id="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/AA" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-primary" required={showPaymentForm} />
                        </div>
                        <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                            <input type="text" id="cvc" value={formData.cvc} onChange={handleInputChange} placeholder="•••" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-primary" required={showPaymentForm} />
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé de la commande</h2>
              <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <li key={item.product.id} className="flex items-center py-4">
                    <img src={item.product.images[0]} alt={item.product.name} className="h-16 w-16 rounded-md object-cover" />
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{(item.product.price * item.quantity).toFixed(2)} DA</p>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-base text-gray-700">
                  <span>Sous-total</span>
                  <span>{cartTotal.toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between text-base text-gray-700">
                  <span>Livraison</span>
                  <span>{formData.city ? `${shippingCost.toFixed(2)} DA` : 'Sélectionnez une wilaya'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-2">
                  <p>Total</p>
                  <p>{(cartTotal + shippingCost).toFixed(2)} DA</p>
                </div>
              </div>
              <div className="mt-6">
                <button type="submit" className="w-full flex items-center justify-center rounded-md border border-transparent bg-accent px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-accent-hover">
                  Confirmer la commande
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;