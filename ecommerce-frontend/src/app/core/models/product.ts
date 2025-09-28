export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export interface UpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  imageUrl?: string;
  isActive?: boolean;
}

