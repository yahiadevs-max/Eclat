import { Delivery } from '../types';

export const mockDeliveries: Delivery[] = [
  {
    orderId: '#123-456789',
    customerName: 'Alice Martin',
    address: '123 Rue de Paris, 75001 Paris',
    shippingDate: '2024-05-21',
    trackingNumber: 'LP123456789FR',
    status: 'Livrée',
  },
  {
    orderId: '#123-456790',
    customerName: 'Bob Dupont',
    address: '45 Avenue de Lyon, 69002 Lyon',
    shippingDate: '2024-05-22',
    trackingNumber: 'LP987654321FR',
    status: 'En transit',
  },
  {
    orderId: '#123-456791',
    customerName: 'Claire Durand',
    address: '78 Boulevard de Marseille, 13008 Marseille',
    shippingDate: 'N/A',
    trackingNumber: 'N/A',
    status: 'Préparation',
  },
];
