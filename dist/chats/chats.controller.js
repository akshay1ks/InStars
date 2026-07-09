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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsController = void 0;
/**
 * chats.controller.ts — REST surface of the chat feature.
 *
 *   POST   /api/chats/start            { userId }  -> start/resume a chat
 *   GET    /api/chats                              -> Chats tab list
 *   GET    /api/chats/requests                     -> Requests tab list
 *   GET    /api/chats/:id                          -> history + header info
 *   POST   /api/chats/:id/messages     { content } -> send a message
 *   POST   /api/chats/:id/reveal-request           -> ask other user to reveal
 *   POST   /api/chats/:id/reveal-approve           -> reveal MY profile
 *   GET    /api/chats/:id/revealed-profile         -> other user's profile
 *   DELETE /api/chats/:id                          -> delete chat (for me)
 */
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../common/current-user.decorator");
const user_entity_1 = require("../users/user.entity");
const chats_service_1 = require("./chats.service");
class StartChatDto {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StartChatDto.prototype, "userId", void 0);
class SendMessageDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
let ChatsController = class ChatsController {
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    start(me, dto) {
        return this.chatsService.startChat(me, dto.userId);
    }
    listChats(me) {
        return this.chatsService.listChats(me);
    }
    listRequests(me) {
        return this.chatsService.listRequests(me);
    }
    detail(id, me) {
        return this.chatsService.getChatDetail(id, me);
    }
    send(id, me, dto) {
        return this.chatsService.sendMessage(id, me, dto.content);
    }
    requestReveal(id, me) {
        return this.chatsService.requestReveal(id, me);
    }
    approveReveal(id, me) {
        return this.chatsService.approveReveal(id, me);
    }
    revealedProfile(id, me) {
        return this.chatsService.getRevealedProfile(id, me);
    }
    remove(id, me) {
        return this.chatsService.deleteChat(id, me);
    }
};
exports.ChatsController = ChatsController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, StartChatDto]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "start", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "listChats", null);
__decorate([
    (0, common_1.Get)('requests'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "listRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User,
        SendMessageDto]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "send", null);
__decorate([
    (0, common_1.Post)(':id/reveal-request'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "requestReveal", null);
__decorate([
    (0, common_1.Post)(':id/reveal-approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "approveReveal", null);
__decorate([
    (0, common_1.Get)(':id/revealed-profile'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "revealedProfile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "remove", null);
exports.ChatsController = ChatsController = __decorate([
    (0, common_1.Controller)('chats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatsController);
//# sourceMappingURL=chats.controller.js.map