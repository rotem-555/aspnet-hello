using System;
using System.ComponentModel.DataAnnotations;

namespace HelloWeb.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Category { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateProductDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock must be 0 or greater")]
        public int Stock { get; set; }

        [StringLength(50)]
        public string Category { get; set; }
    }

    public class UpdateProductDto
    {
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal? Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Stock must be 0 or greater")]
        public int? Stock { get; set; }

        [StringLength(50)]
        public string Category { get; set; }

    }
}
