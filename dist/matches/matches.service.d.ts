import { Repository } from 'typeorm';
import { Chat } from '../chats/chat.entity';
import { User } from '../users/user.entity';
export declare class MatchesService {
    private readonly users;
    private readonly chats;
    constructor(users: Repository<User>, chats: Repository<Chat>);
    findMatches(me: User): Promise<{
        alreadyChatted: boolean;
        userId: string;
        anonymousName: string;
        distanceKm: number | null;
        compatibility: number;
        revealed: boolean;
        name: string | null;
        photo: string | null;
    }[]>;
    /**
     * Very small gender/interest gate. `interestedIn` is Men/Women/Everyone;
     * we don't collect gender explicitly, so orientation-based matching is
     * approximated by the mutual "interested in" preference when available.
     */
    private mutualInterestOk;
}
