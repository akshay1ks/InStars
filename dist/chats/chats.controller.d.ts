import { User } from '../users/user.entity';
import { ChatsService } from './chats.service';
declare class StartChatDto {
    userId: string;
}
declare class SendMessageDto {
    content: string;
}
export declare class ChatsController {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    start(me: User, dto: StartChatDto): Promise<{
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
    detail(id: string, me: User): Promise<{
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
    send(id: string, me: User, dto: SendMessageDto): Promise<{
        id: string;
        chatId: string;
        senderId: string;
        content: string;
        createdAt: Date;
    }>;
    requestReveal(id: string, me: User): Promise<{
        message: string;
    }>;
    approveReveal(id: string, me: User): Promise<{
        message: string;
    }>;
    revealedProfile(id: string, me: User): Promise<{
        id: string;
        name: string | null;
        photos: string[];
        aboutMe: string | null;
        interests: string[];
        school: string | null;
        habits: Record<string, string>;
    }>;
    remove(id: string, me: User): Promise<{
        message: string;
    }>;
}
export {};
