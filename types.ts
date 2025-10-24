// FIX: Removed self-import of 'Product' which conflicted with the local declaration.

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'En attente' | 'Expédiée' | 'Livrée' | 'Annulée';
  items: { product: Product; quantity: number }[];
}

export interface Delivery {
  orderId: string;
  customerName: string;
  address: string;
  shippingDate: string;
  trackingNumber: string;
  status: 'Préparation' | 'Expédiée' | 'En transit' | 'Livrée';
}

export interface Payment {
  transactionId: string;
  orderId: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  status: 'Réussi' | 'En attente' | 'Échoué' | 'Remboursé';
}

export interface ReturnRequest {
  requestId: string;
  orderId: string;
  customerName: string;
  productName: string;
  reason: string;
  requestDate: string;
  status: 'Demandé' | 'Approuvé' | 'Rejeté' | 'Terminé';
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
  subcategory?: string;
  images: string[];
  description: string;
  stock: number;
  rating: number;
  reviews: number;
  sizes?: string[];
  colors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface WishlistItem {
  product: Product;
}

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl: string;
}