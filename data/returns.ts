import { ReturnRequest } from '../types';

export const mockReturnRequests: ReturnRequest[] = [
  {
    requestId: 'RTN-001',
    orderId: '#123-456789',
    customerName: 'Alice Martin',
    productName: 'T-shirt en Coton Bio',
    reason: 'Taille incorrecte',
    requestDate: '2024-05-23',
    status: 'Demandé',
  },
  {
    requestId: 'RTN-002',
    orderId: '#123-456788',
    customerName: 'Eve Leroy',
    productName: 'Pull en Laine Mérinos',
    reason: 'Défaut de fabrication',
    requestDate: '2024-05-22',
    status: 'Approuvé',
  },
  {
    requestId: 'RTN-003',
    orderId: '#123-456787',
    customerName: 'Frank Moreau',
    productName: 'Bottes en Cuir Chelsea',
    reason: 'Changé d\'avis',
    requestDate: '2024-05-21',
    status: 'Rejeté',
  },
    {
    requestId: 'RTN-004',
    orderId: '#123-456786',
    customerName: 'Grace Simon',
    productName: 'Sac à Dos en Toile',
    reason: 'Non conforme à la description',
    requestDate: '2024-05-20',
    status: 'Terminé',
  },
];
