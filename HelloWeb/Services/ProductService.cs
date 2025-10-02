using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HelloWeb.Data;
using HelloWeb.DTOs;
using HelloWeb.Models;

namespace HelloWeb.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .OrderBy(p => p.Name)
                .ToListAsync();

            return products.Select(MapToDto);
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string category)
        {
            var products = await _context.Products
                .Where(p => p.Category == category)
                .OrderBy(p => p.Name)
                .ToListAsync();

            return products.Select(MapToDto);
        }

        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return null;

            return MapToDto(product);
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            var product = new Product
            {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                Price = createProductDto.Price,
                Stock = createProductDto.Stock,
                Category = createProductDto.Category,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return MapToDto(product);
        }

        public async Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return null;

            if (updateProductDto.Name != null)
                product.Name = updateProductDto.Name;
            if (updateProductDto.Description != null)
                product.Description = updateProductDto.Description;
            if (updateProductDto.Price.HasValue)
                product.Price = updateProductDto.Price.Value;
            if (updateProductDto.Stock.HasValue)
                product.Stock = updateProductDto.Stock.Value;
            if (updateProductDto.Category != null)
                product.Category = updateProductDto.Category;

            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(product);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            // Hard delete the product
            _context.Products.Remove(product);
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync()
        {
            return await _context.Products
                .Where(p => !string.IsNullOrEmpty(p.Category))
                .Select(p => p.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }

        private static ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Category = product.Category,
                CreatedAt = product.CreatedAt
            };
        }
    }
}
