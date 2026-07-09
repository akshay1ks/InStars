import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private readonly users;
    constructor(users: Repository<User>);
    findById(id: string): Promise<User>;
    /**
     * Partial update — merges only the fields present in the DTO, so each
     * onboarding screen can save its own slice of the profile independently.
     */
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<User>;
    /** "Delete account" from the Profile screen's settings menu (Screen 27).
     *  Chats and messages cascade-delete via their foreign keys. */
    deleteAccount(userId: string): Promise<void>;
}
