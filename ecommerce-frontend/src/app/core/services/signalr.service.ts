import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ConnectedUser {
  connectionId: string;
  username: string;
  role: string;
  connectedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  private connectedUsersSubject = new BehaviorSubject<ConnectedUser[]>([]);
  public connectedUsers$ = this.connectedUsersSubject.asObservable();

  constructor(private authService: AuthService) {
    // Auto-connect if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.startConnection();
    }
  }

  private initializeConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/userConnectionHub', {
        accessTokenFactory: () => this.authService.getToken() || ''
      })
      .withAutomaticReconnect()
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.hubConnection.on('UserConnected', (user: ConnectedUser) => {
      const currentUsers = this.connectedUsersSubject.value;
      const updatedUsers = [...currentUsers, user];
      this.connectedUsersSubject.next(updatedUsers);
    });

    this.hubConnection.on('UserDisconnected', (username: string) => {
      const currentUsers = this.connectedUsersSubject.value;
      const updatedUsers = currentUsers.filter(user => user.username !== username);
      this.connectedUsersSubject.next(updatedUsers);
    });

    this.hubConnection.on('ConnectedUsersList', (users: ConnectedUser[]) => {
      this.connectedUsersSubject.next(users);
    });
  }

  async startConnection(): Promise<void> {
    if (!this.hubConnection) {
      this.initializeConnection();
    }
    
    if (this.hubConnection.state === HubConnectionState.Disconnected) {
      try {
        await this.hubConnection.start();
        
        // Join admin group if user is admin
        if (this.authService.isAdmin()) {
          await this.hubConnection.invoke('JoinAdminGroup');
          await this.hubConnection.invoke('GetConnectedUsers');
        }
      } catch (error) {
        console.error('Error starting SignalR connection:', error);
      }
    }
  }

  async stopConnection(): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.stop();
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
    }
  }

  getConnectionState(): HubConnectionState {
    return this.hubConnection?.state || HubConnectionState.Disconnected;
  }

  isConnected(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connected;
  }

  // Method to be called when user logs in
  onUserLogin(): void {
    if (this.authService.isLoggedIn() && !this.isConnected()) {
      this.startConnection();
    }
  }

  // Method to be called when user logs out
  onUserLogout(): void {
    this.stopConnection();
  }
}
