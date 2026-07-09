import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
interface JwtPayload {
    sub: string;
    phone: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly users;
    constructor(config: ConfigService, users: Repository<User>);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
