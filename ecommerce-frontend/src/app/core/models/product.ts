export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface UpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  isActive?: boolean;
}

