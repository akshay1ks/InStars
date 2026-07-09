import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ChatsService } from './chats.service';
export declare class ChatsGateway implements OnGatewayConnection {
    private readonly jwt;
    private readonly chatsService;
    private readonly users;
    server: Server;
    private readonly logger;
    constructor(jwt: JwtService, chatsService: ChatsService, users: Repository<User>);
    /** Verify the JWT from the handshake and stash the user on the socket. */
    handleConnection(socket: Socket): Promise<void>;
    /** The chat screen joins its chat's room on mount. */
    handleJoin(socket: Socket, body: {
        chatId: string;
    }): {
        joined: string;
    };
    /** Persist + fan out a message to everyone in the chat room. */
    handleMessage(socket: Socket, body: {
        chatId: string;
        content: string;
    }): Promise<{
        id: string;
        chatId: string;
        senderId: string;
        content: string;
        createdAt: Date;
    }>;
}
