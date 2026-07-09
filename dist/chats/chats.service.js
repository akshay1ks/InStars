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
exports.ChatsService = void 0;
/**
 * chats.service.ts — everything behind Screens 22-26:
 * starting a chat, the Chats / Requests tab lists, message history,
 * sending messages, unread counts, the reveal-profile handshake,
 * and per-user chat deletion.
 */
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const compatibility_util_1 = require("../matches/compatibility.util");
const user_entity_1 = require("../users/user.entity");
const chat_entity_1 = require("./chat.entity");
const message_entity_1 = require("./message.entity");
let ChatsService = class ChatsService {
    constructor(chats, messages, users) {
        this.chats = chats;
        this.messages = messages;
        this.users = users;
    }
    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------
    /** Load a chat and make sure `userId` is one of its two participants. */
    async getChatForUser(chatId, userId) {
        const chat = await this.chats.findOne({ where: { id: chatId } });
        if (!chat)
            throw new common_1.NotFoundException('Chat not found');
        if (chat.initiatorId !== userId && chat.recipientId !== userId) {
            throw new common_1.ForbiddenException('You are not part of this chat');
        }
        return chat;
    }
    /** The other participant of a chat, relative to `userId`. */
    otherUser(chat, userId) {
        return chat.initiatorId === userId ? chat.recipient : chat.initiator;
    }
    /** Has the OTHER user revealed their profile to me in this chat? */
    otherRevealed(chat, myId) {
        return chat.initiatorId === myId
            ? chat.revealedByRecipient
            : chat.revealedByInitiator;
    }
    // ---------------------------------------------------------------------
    // Starting a chat (Screen 22 "Start" button)
    // ---------------------------------------------------------------------
    /**
     * Start (or resume) a chat with another user. If a chat between the two
     * already exists we simply return it, so tapping the same profile twice
     * never creates a duplicate conversation.
     */
    async startChat(me, otherUserId) {
        const other = await this.users.findOne({ where: { id: otherUserId } });
        if (!other)
            throw new common_1.NotFoundException('User not found');
        let chat = await this.chats.findOne({
            where: [
                { initiatorId: me.id, recipientId: otherUserId },
                { initiatorId: otherUserId, recipientId: me.id },
            ],
        });
        if (!chat) {
            chat = this.chats.create({
                initiatorId: me.id,
                recipientId: otherUserId,
            });
            chat = await this.chats.save(chat);
            // Re-load with eager relations populated.
            chat = (await this.chats.findOne({ where: { id: chat.id } }));
        }
        else {
            // Re-opening a chat un-deletes it for me (standard messenger behaviour).
            if (chat.initiatorId === me.id && chat.deletedByInitiator) {
                chat.deletedByInitiator = false;
                await this.chats.save(chat);
            }
            else if (chat.recipientId === me.id && chat.deletedByRecipient) {
                chat.deletedByRecipient = false;
                await this.chats.save(chat);
            }
        }
        return this.chatSummary(chat, me);
    }
    // ---------------------------------------------------------------------
    // Tab lists (Screens 25 & 26)
    // ---------------------------------------------------------------------
    /**
     * "Chats" tab (Screen 25): every conversation I started, plus received
     * conversations I have already replied to. Sorted by latest activity.
     */
    async listChats(me) {
        const all = await this.visibleChats(me.id);
        const mine = all.filter((c) => c.initiatorId === me.id || c.recipientReplied);
        return Promise.all(mine.map((c) => this.chatSummary(c, me)));
    }
    /**
     * "Received chat requests" tab (Screen 26): conversations someone else
     * started with me and I have NOT replied to yet.
     */
    async listRequests(me) {
        const all = await this.visibleChats(me.id);
        const requests = all.filter((c) => c.recipientId === me.id && !c.recipientReplied);
        return Promise.all(requests.map((c) => this.chatSummary(c, me)));
    }
    /** All chats I participate in and have not deleted. */
    async visibleChats(myId) {
        const all = await this.chats.find({
            where: [{ initiatorId: myId }, { recipientId: myId }],
            order: { createdAt: 'DESC' },
        });
        return all.filter((c) => c.initiatorId === myId ? !c.deletedByInitiator : !c.deletedByRecipient);
    }
    /**
     * One row tile for the Chats/Requests lists: anonymous (or revealed) name,
     * distance, compatibility %, unread badge count and the last message.
     */
    async chatSummary(chat, me) {
        const other = this.otherUser(chat, me.id);
        const revealed = this.otherRevealed(chat, me.id);
        const unread = await this.messages.count({
            where: { chatId: chat.id, read: false, senderId: other.id },
        });
        const lastMessage = await this.messages.findOne({
            where: { chatId: chat.id },
            order: { createdAt: 'DESC' },
        });
        return {
            chatId: chat.id,
            ...(0, compatibility_util_1.profileTile)(me, other, { revealed }),
            unreadCount: unread,
            lastMessage: lastMessage
                ? { content: lastMessage.content, createdAt: lastMessage.createdAt }
                : null,
            // Reveal-handshake state, used by the chat screen header button.
            iRevealed: chat.initiatorId === me.id
                ? chat.revealedByInitiator
                : chat.revealedByRecipient,
            revealRequestedByMe: chat.revealRequestedById === me.id,
            revealRequestedByOther: chat.revealRequestedById != null && chat.revealRequestedById !== me.id,
        };
    }
    // ---------------------------------------------------------------------
    // Messages (Screens 23/24)
    // ---------------------------------------------------------------------
    /** Full history + header info for the chat screen. Marks incoming as read. */
    async getChatDetail(chatId, me) {
        const chat = await this.getChatForUser(chatId, me.id);
        // Opening the chat clears the unread badge for messages sent to me.
        const other = this.otherUser(chat, me.id);
        await this.messages.update({ chatId, senderId: other.id, read: false }, { read: true });
        const history = await this.messages.find({
            where: { chatId },
            order: { createdAt: 'ASC' },
        });
        return {
            summary: await this.chatSummary(chat, me),
            messages: history.map((m) => ({
                id: m.id,
                senderId: m.senderId,
                content: m.content,
                createdAt: m.createdAt,
                mine: m.senderId === me.id,
            })),
        };
    }
    /** Persist a new message. Returns the saved message (the gateway then
     *  broadcasts it to the chat room so the other device updates live). */
    async sendMessage(chatId, me, content) {
        const chat = await this.getChatForUser(chatId, me.id);
        const message = await this.messages.save(this.messages.create({ chatId, senderId: me.id, content }));
        // First reply from the recipient moves the chat from their "Requests"
        // tab into the regular "Chats" tab (requirements, Screen 26).
        if (chat.recipientId === me.id && !chat.recipientReplied) {
            chat.recipientReplied = true;
            await this.chats.save(chat);
        }
        // A new message makes the chat visible again even if the other side had
        // deleted it earlier.
        return {
            id: message.id,
            chatId,
            senderId: me.id,
            content: message.content,
            createdAt: message.createdAt,
        };
    }
    // ---------------------------------------------------------------------
    // Reveal profile (Screens 23/24 header button)
    // ---------------------------------------------------------------------
    /** Ask the other participant to reveal their profile to me. */
    async requestReveal(chatId, me) {
        const chat = await this.getChatForUser(chatId, me.id);
        chat.revealRequestedById = me.id;
        await this.chats.save(chat);
        return { message: 'Reveal request sent' };
    }
    /** Approve the pending request: MY profile becomes visible to the other user. */
    async approveReveal(chatId, me) {
        const chat = await this.getChatForUser(chatId, me.id);
        if (chat.initiatorId === me.id)
            chat.revealedByInitiator = true;
        else
            chat.revealedByRecipient = true;
        chat.revealRequestedById = null; // request resolved
        await this.chats.save(chat);
        return { message: 'Profile revealed' };
    }
    /** Once revealed, the other user's full profile is viewable. */
    async getRevealedProfile(chatId, me) {
        const chat = await this.getChatForUser(chatId, me.id);
        if (!this.otherRevealed(chat, me.id)) {
            throw new common_1.ForbiddenException('This profile has not been revealed to you');
        }
        const other = this.otherUser(chat, me.id);
        const { id, name, photos, aboutMe, interests, school, habits } = other;
        return { id, name, photos, aboutMe, interests, school, habits };
    }
    // ---------------------------------------------------------------------
    // Delete chat (long-press menu on Screen 25)
    // ---------------------------------------------------------------------
    async deleteChat(chatId, me) {
        const chat = await this.getChatForUser(chatId, me.id);
        if (chat.initiatorId === me.id)
            chat.deletedByInitiator = true;
        else
            chat.deletedByRecipient = true;
        await this.chats.save(chat);
        return { message: 'Chat deleted' };
    }
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatsService);
//# sourceMappingURL=chats.service.js.map