import { Order } from '../types';
import { products } from './products';

export const mockOrders: Order[] = [
  {
    id: '#123-456789',
    customerName: 'Alice Martin',
    date: '2024-05-20',
    total: 109.89,
    status: 'Livrée',
    items: [
      { product: products[0], quantity: 1 },
      { product: products[1], quantity: 1 },
    ],
  },
  {
    id: '#123-456790',
    customerName: 'Bob Dupont',
    date: '2024-05-21',
    total: 119.99,
    status: 'Expédiée',
    items: [{ product: products[2], quantity: 1 }],
  },
  {
    id: '#123-456791',
    customerName: 'Claire Durand',
    date: '2024-05-22',
    total: 120.5,
    status: 'En attente',
    items: [
      { product: products[3], quantity: 1 },
      { product: products[4], quantity: 1 },
    ],
  },
    {
    id: '#123-456792',
    customerName: 'David Petit',
    date: '2024-05-18',
    total: 250.0,
    status: 'Annulée',
    items: [{ product: products[5], quantity: 1 }],
  },
];
