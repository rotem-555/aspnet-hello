using System.Collections.Generic;
using System.Threading.Tasks;
using HelloWeb.DTOs;
using HelloWeb.Models;

namespace HelloWeb.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string category);
        Task<ProductDto> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
        Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto updateProductDto);
        Task<bool> DeleteProductAsync(int id);
        Task<IEnumerable<string>> GetCategoriesAsync();
    }
}
