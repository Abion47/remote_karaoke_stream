import http from "http";
import ws, { Server as WSServer } from "ws";

export type User = {
  id: string;
  name: string;
}

export type Packet = {
  event: string;
  data: any;
}

export class Server {
  private socketServer: WSServer;

  private connectedUsers: User[] = [];

  constructor() {
    const host = process.env.DEFAULT_HOST;
    const port = parseInt(process.env.DEFAULT_PORT ?? "80");

    this.socketServer = new ws.Server({
      host,
      port,
    });

    this.handleSocketConnection();
  }

  broadcast(packet: Packet) {
    const payload = Buffer.from(JSON.stringify(packet));

    this.socketServer.clients.forEach((client) => {
      client.send(payload, { binary: true });
    });
  }

  handleSocketConnection() {
    this.socketServer.on('connection', (socket, msg) => {
      const id = msg.headers['user-identity-id'] as string;
      const name = msg.headers['user-identity-name'] as string;
      
      console.log(`Connected: ${name} (${id})`);

      const knownUser = this.connectedUsers.find(user => user.id === id);
      if (!knownUser) {
        this.connectedUsers.push({ id, name });

        this.broadcast({
          event: 'update-user-list',
          data: { users: this.connectedUsers },
        });
      }

      socket.on('close', _ => {
        console.log(`Disconnected: ${name} (${id})`);

        const knownUser = this.connectedUsers.findIndex(user => user.id === id);
        if (knownUser >= 0) {
          const removedUsers = this.connectedUsers.splice(knownUser, 1);

          this.broadcast({
            event: 'remove-users',
            data: {users: removedUsers},
          });
        }
      });
    });

    this.socketServer.on('error', (error) => {
      console.log(`Error: ${error}`);
    })
  }

  close() {
    this.socketServer.close();
  }

  
}