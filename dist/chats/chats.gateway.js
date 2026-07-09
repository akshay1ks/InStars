"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsGateway = void 0;
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
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const chats_service_1 = require("./chats.service");
let ChatsGateway = ChatsGateway_1 = class ChatsGateway {
    constructor(jwt, chatsService, users) {
        this.jwt = jwt;
        this.chatsService = chatsService;
        this.users = users;
        this.logger = new common_1.Logger(ChatsGateway_1.name);
    }
    /** Verify the JWT from the handshake and stash the user on the socket. */
    async handleConnection(socket) {
        try {
            const token = socket.handshake.auth?.token;
            if (!token)
                throw new common_1.UnauthorizedException();
            const payload = await this.jwt.verifyAsync(token);
            const user = await this.users.findOne({ where: { id: payload.sub } });
            if (!user)
                throw new common_1.UnauthorizedException();
            socket.data.user = user;
        }
        catch {
            this.logger.warn('Rejected unauthenticated socket');
            socket.disconnect(true);
        }
    }
    /** The chat screen joins its chat's room on mount. */
    handleJoin(socket, body) {
        socket.join(`chat:${body.chatId}`);
        return { joined: body.chatId };
    }
    /** Persist + fan out a message to everyone in the chat room. */
    async handleMessage(socket, body) {
        const user = socket.data.user;
        const saved = await this.chatsService.sendMessage(body.chatId, user, body.content);
        // Broadcast to BOTH participants (sender uses it as the delivery ack).
        this.server.to(`chat:${body.chatId}`).emit('message:new', saved);
        return saved;
    }
};
exports.ChatsGateway = ChatsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatsGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleMessage", null);
exports.ChatsGateway = ChatsGateway = ChatsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: true } }),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        chats_service_1.ChatsService,
        typeorm_2.Repository])
], ChatsGateway);
//# sourceMappingURL=chats.gateway.js.map