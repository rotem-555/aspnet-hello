using System.Threading.Tasks;
using HelloWeb.DTOs;
using HelloWeb.Models;

namespace HelloWeb.Services
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<User> RegisterAsync(string username, string password, string email, string firstName, string lastName);
    }
}
