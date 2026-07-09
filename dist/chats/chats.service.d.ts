import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
export declare class ChatsService {
    private readonly chats;
    private readonly messages;
    private readonly users;
    constructor(chats: Repository<Chat>, messages: Repository<Message>, users: Repository<User>);
    /** Load a chat and make sure `userId` is one of its two participants. */
    private getChatForUser;
    /** The other participant of a chat, relative to `userId`. */
    private otherUser;
    /** Has the OTHER user revealed their profile to me in this chat? */
    private otherRevealed;
    /**
     * Start (or resume) a chat with another user. If a chat between the two
     * already exists we simply return it, so tapping the same profile twice
     * never creates a duplicate conversation.
     */
    startChat(me: User, otherUserId: string): Promise<{
        unreadCount: number;
        lastMessage: {
            content: string;
            createdAt: Date;
        } | null;
        iRevealed: boolean;
        revealRequestedByMe: boolean;
        revealRequestedByOther: boolean;
        userId: string;
        anonymousName: string;
        distanceKm: number | null;
        compatibility: number;
        revealed: boolean;
        name: string | null;
        photo: string | null;
        chatId: string;
    }>;
    /**
     * "Chats" tab (Screen 25): every conversation I started, plus received
     * conversations I have already replied to. Sorted by latest activity.
     */
    listChats(me: User): Promise<{
        unreadCount: number;
        lastMessage: {
            content: string;
            createdAt: Date;
        } | null;
        iRevealed: boolean;
        revealRequestedByMe: boolean;
        revealRequestedByOther: boolean;
        userId: string;
        anonymousName: string;
        distanceKm: number | null;
        compatibility: number;
        revealed: boolean;
        name: string | null;
        photo: string | null;
        chatId: string;
    }[]>;
    /**
     * "Received chat requests" tab (Screen 26): conversations someone else
     * started with me and I have NOT replied to yet.
     */
    listRequests(me: User): Promise<{
        unreadCount: number;
        lastMessage: {
            content: string;
            createdAt: Date;
        } | null;
        iRevealed: boolean;
        revealRequestedByMe: boolean;
        revealRequestedByOther: boolean;
        userId: string;
        anonymousName: string;
        distanceKm: number | null;
        compatibility: number;
        revealed: boolean;
        name: string | null;
        photo: string | null;
        chatId: string;
    }[]>;
    /** All chats I participate in and have not deleted. */
    private visibleChats;
    /**
     * One row tile for the Chats/Requests lists: anonymous (or revealed) name,
     * distance, compatibility %, unread badge count and the last message.
     */
    private chatSummary;
    /** Full history + header info for the chat screen. Marks incoming as read. */
    getChatDetail(chatId: string, me: User): Promise<{
        summary: {
            unreadCount: number;
            lastMessage: {
                content: string;
                createdAt: Date;
            } | null;
            iRevealed: boolean;
            revealRequestedByMe: boolean;
            revealRequestedByOther: boolean;
            userId: string;
            anonymousName: string;
            distanceKm: number | null;
            compatibility: number;
            revealed: boolean;
            name: string | null;
            photo: string | null;
            chatId: string;
        };
        messages: {
            id: string;
            senderId: string;
            content: string;
            createdAt: Date;
            mine: boolean;
        }[];
    }>;
    /** Persist a new message. Returns the saved message (the gateway then
     *  broadcasts it to the chat room so the other device updates live). */
    sendMessage(chatId: string, me: User, content: string): Promise<{
        id: string;
        chatId: string;
        senderId: string;
        content: string;
        createdAt: Date;
    }>;
    /** Ask the other participant to reveal their profile to me. */
    requestReveal(chatId: string, me: User): Promise<{
        message: string;
    }>;
    /** Approve the pending request: MY profile becomes visible to the other user. */
    approveReveal(chatId: string, me: User): Promise<{
        message: string;
    }>;
    /** Once revealed, the other user's full profile is viewable. */
    getRevealedProfile(chatId: string, me: User): Promise<{
        id: string;
        name: string | null;
        photos: string[];
        aboutMe: string | null;
        interests: string[];
        school: string | null;
        habits: Record<string, string>;
    }>;
    deleteChat(chatId: string, me: User): Promise<{
        message: string;
    }>;
}
