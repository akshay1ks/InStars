import { Chat } from './chat.entity';
import { User } from '../users/user.entity';
export declare class Message {
    id: string;
    chat: Chat;
    chatId: string;
    sender: User;
    senderId: string;
    /** Message body. Plain text for now. */
    content: string;
    /** True once the other participant has opened the chat after this message. */
    read: boolean;
    createdAt: Date;
}
