import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, CreateProduct, UpdateProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  getProducts(category?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<Product[]>(`${this.API_URL}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/products/categories`);
  }

  createProduct(product: CreateProduct): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/products`, product);
  }

  updateProduct(id: number, product: UpdateProduct): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/products/${id}`);
  }
}
