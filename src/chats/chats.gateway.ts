/**
 * chats.gateway.ts — Socket.IO gateway for live messaging (Screens 23/24).
 *
 * How it works with the REST API:
 *  - Sending still goes through POST /api/chats/:id/messages (single source
 *    of truth, persisted in Postgres).
 *  - The mobile app ALSO connects a socket and joins a room per chat. When
 *    someone sends a message the app emits `message:send`; the gateway
 *    persists it via ChatsService and broadcasts `message:new` to the room,
 *    so the other device renders it instantly without polling.
 *
 * Authentication: the client passes its JWT in the socket handshake
 * (`auth: { token }`); we verify it before letting the socket do anything.
 */
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ChatsService } from './chats.service';

@WebSocketGateway({ cors: { origin: true } })
export class ChatsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatsGateway.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly chatsService: ChatsService,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  /** Verify the JWT from the handshake and stash the user on the socket. */
  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) throw new UnauthorizedException();
      const payload = await this.jwt.verifyAsync(token);
      const user = await this.users.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      socket.data.user = user;
    } catch {
      this.logger.warn('Rejected unauthenticated socket');
      socket.disconnect(true);
    }
  }

  /** The chat screen joins its chat's room on mount. */
  @SubscribeMessage('chat:join')
  handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { chatId: string },
  ) {
    socket.join(`chat:${body.chatId}`);
    return { joined: body.chatId };
  }

  /** Persist + fan out a message to everyone in the chat room. */
  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { chatId: string; content: string },
  ) {
    const user = socket.data.user as User;
    const saved = await this.chatsService.sendMessage(
      body.chatId,
      user,
      body.content,
    );
    // Broadcast to BOTH participants (sender uses it as the delivery ack).
    this.server.to(`chat:${body.chatId}`).emit('message:new', saved);
    return saved;
  }
}
