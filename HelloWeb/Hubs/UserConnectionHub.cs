using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HelloWeb.Hubs
{
    [Authorize]
    public class UserConnectionHub : Hub
    {
        private static readonly Dictionary<string, ConnectedUser> ConnectedUsers = new Dictionary<string, ConnectedUser>();
        private const string AdminRole = "Admin";

        public override async Task OnConnectedAsync()
        {
            var username = Context.User?.FindFirst("username")?.Value;
            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;

            if (!string.IsNullOrEmpty(username))
            {
                var connectedUser = new ConnectedUser
                {
                    ConnectionId = Context.ConnectionId,
                    Username = username,
                    Role = role ?? "Customer",
                    ConnectedAt = DateTime.UtcNow
                };

                ConnectedUsers[Context.ConnectionId] = connectedUser;

                // Notify admins about new user connection
                await Clients.Group("Admins").SendAsync("UserConnected", connectedUser);
                
                // Add user to appropriate group
                if (role == AdminRole)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (ConnectedUsers.TryGetValue(Context.ConnectionId, out var user))
            {
                ConnectedUsers.Remove(Context.ConnectionId);
                
                // Notify admins about user disconnection
                await Clients.Group("Admins").SendAsync("UserDisconnected", user.Username);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task GetConnectedUsers()
        {
            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
            
            if (role == AdminRole)
            {
                var users = ConnectedUsers.Values.ToList();
                await Clients.Caller.SendAsync("ConnectedUsersList", users);
            }
        }

        public async Task JoinAdminGroup()
        {
            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
            
            if (role == AdminRole)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
            }
        }
    }

    public class ConnectedUser
    {
        public string ConnectionId { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public DateTime ConnectedAt { get; set; }
    }
}
