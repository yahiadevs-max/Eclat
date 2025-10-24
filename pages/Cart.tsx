import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { TrashIcon } from '../components/icons';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Votre Panier</h1>
        {cartItems.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <p className="text-gray-600 text-xl mb-6">Votre panier est vide.</p>
            <Link to="/products" className="bg-accent text-white font-bold py-3 px-8 rounded-md hover:bg-accent-hover transition-colors">
              Continuer mes achats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <li key={item.product.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                          </h3>
                          <p className="ml-4">{(item.product.price * item.quantity).toFixed(2)} DA</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.color} {item.size && `, ${item.size}`}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border rounded-md">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1">-</button>
                          <span className="px-3">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1">+</button>
                        </div>
                        <div className="flex">
                          <button onClick={() => removeFromCart(item.product.id)} type="button" className="font-medium text-accent hover:text-accent-hover flex items-center gap-1">
                            <TrashIcon className="w-4 h-4" /> Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé de la commande</h2>
                <div className="flex justify-between text-base text-gray-700 py-2">
                  <span>Sous-total ({cartCount} articles)</span>
                  <span>{cartTotal.toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between text-base text-gray-700 py-2">
                  <span>Livraison</span>
                  <span>Calculée à la prochaine étape</span>
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <p>Total</p>
                    <p>{cartTotal.toFixed(2)} DA</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link to="/checkout" className="w-full flex items-center justify-center rounded-md border border-transparent bg-accent px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-accent-hover">
                    Passer la commande
                  </Link>
                </div>
                <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    ou{' '}
                    <Link to="/products" className="font-medium text-accent hover:text-accent-hover">
                      Continuer mes achats
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;