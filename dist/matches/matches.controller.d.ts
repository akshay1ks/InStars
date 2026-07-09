import { User } from '../users/user.entity';
import { MatchesService } from './matches.service';
export declare class MatchesController {
    private readonly matches;
    constructor(matches: MatchesService);
    list(user: User): Promise<{
        alreadyChatted: boolean;
        userId: string;
        anonymousName: string;
        distanceKm: number | null;
        compatibility: number;
        revealed: boolean;
        name: string | null;
        photo: string | null;
    }[]>;
}
