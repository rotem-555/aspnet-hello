import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Product, CreateProduct, UpdateProduct } from '../../core/models/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMessage = '';
  showCreateForm = false;
  editingProduct: Product | null = null;

  newProduct: CreateProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: ''
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  createProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.resetForm();
        this.showCreateForm = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create product';
      }
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = { ...product };
  }

  updateProduct(): void {
    if (this.editingProduct) {
      const updateData: UpdateProduct = {
        name: this.editingProduct.name,
        description: this.editingProduct.description,
        price: this.editingProduct.price,
        stock: this.editingProduct.stock,
        category: this.editingProduct.category,
      };

      this.productService.updateProduct(this.editingProduct.id, updateData).subscribe({
        next: () => {
          this.loadProducts();
          this.editingProduct = null;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to update product';
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to delete product';
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingProduct = null;
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: ''
    };
  }
}

