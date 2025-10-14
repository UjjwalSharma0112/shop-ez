export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Vendor {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  vendorId: number;
  vendor?: Vendor;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: string;
  items?: OrderItem[];
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}
