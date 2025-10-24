import { Payment } from '../types';

export const mockPayments: Payment[] = [
  {
    transactionId: 'txn_1a2b3c4d5e',
    orderId: '#123-456789',
    customerName: 'Alice Martin',
    amount: 109.89,
    paymentDate: '2024-05-20',
    status: 'Réussi',
  },
  {
    transactionId: 'txn_6f7g8h9i0j',
    orderId: '#123-456790',
    customerName: 'Bob Dupont',
    amount: 119.99,
    paymentDate: '2024-05-21',
    status: 'Réussi',
  },
  {
    transactionId: 'txn_k1l2m3n4o5',
    orderId: '#123-456791',
    customerName: 'Claire Durand',
    amount: 120.5,
    paymentDate: '2024-05-22',
    status: 'En attente',
  },
  {
    transactionId: 'txn_p6q7r8s9t0',
    orderId: '#123-456792',
    customerName: 'David Petit',
    amount: 250.0,
    paymentDate: '2024-05-18',
    status: 'Échoué',
  },
  {
    transactionId: 'txn_u1v2w3x4y5',
    orderId: '#123-456788',
    customerName: 'Eve Leroy',
    amount: 99.99,
    paymentDate: '2024-05-17',
    status: 'Remboursé',
  }
];
