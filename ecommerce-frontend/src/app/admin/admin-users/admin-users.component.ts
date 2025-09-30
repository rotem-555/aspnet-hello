import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalRService, ConnectedUser } from '../../core/services/signalr.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  connectedUsers: ConnectedUser[] = [];
  loading = true;
  connectionStatus = 'Disconnected';

  constructor(
    private signalRService: SignalRService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.authService.isAdmin()) {
      await this.signalRService.startConnection();
      
      this.signalRService.connectedUsers$.subscribe(users => {
        this.connectedUsers = users;
        this.loading = false;
      });

      this.updateConnectionStatus();
    } else {
      this.loading = false;
    }
  }

  async ngOnDestroy(): Promise<void> {
    await this.signalRService.stopConnection();
  }

  private updateConnectionStatus(): void {
    setInterval(() => {
      this.connectionStatus = this.signalRService.isConnected() ? 'Connected' : 'Disconnected';
    }, 1000);
  }

  getConnectedUsersCount(): number {
    return this.connectedUsers.filter(user => user).length;
  }

  getAdminUsersCount(): number {
    return this.connectedUsers.filter(user => user && user.role === 'Admin').length;
  }

  getRegularUsersCount(): number {
    return this.connectedUsers.filter(user => user && user.role !== 'Admin').length;
  }

  formatConnectionTime(connectedAt: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(connectedAt).getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }
}

