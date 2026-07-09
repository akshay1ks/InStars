import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: User): User;
    updateMe(user: User, dto: UpdateProfileDto): Promise<User>;
    deleteMe(user: User): Promise<{
        message: string;
    }>;
}
