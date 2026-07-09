import { User } from '../users/user.entity';
export declare class Chat {
    id: string;
    /** The user who started the chat from the Home screen. */
    initiator: User;
    initiatorId: string;
    /** The user who received the chat request. */
    recipient: User;
    recipientId: string;
    /** True once the recipient has sent at least one message. Controls whether
     *  the chat shows in their "Requests" tab or "Chats" tab. */
    recipientReplied: boolean;
    /** initiator revealed THEIR profile to the recipient. */
    revealedByInitiator: boolean;
    /** recipient revealed THEIR profile to the initiator. */
    revealedByRecipient: boolean;
    /** Pending reveal request: id of the user who asked the other side to
     *  reveal, or null when there is no outstanding request. */
    revealRequestedById: string | null;
    /** Soft-delete flags — "Delete chat" from the long-press menu only hides
     *  the conversation for the user who deleted it. */
    deletedByInitiator: boolean;
    deletedByRecipient: boolean;
    createdAt: Date;
}
