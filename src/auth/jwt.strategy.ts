/**
 * jwt.strategy.ts — validates the `Authorization: Bearer <token>` header on
 * every protected request and loads the matching User row.
 *
 * Whatever this strategy returns from validate() becomes `request.user`,
 * which the @CurrentUser() decorator hands to controller methods.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

interface JwtPayload {
  sub: string; // user id
  phone: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.users.findOne({ where: { id: payload.sub } });
    if (!user) {
      // e.g. the account was deleted from the Profile screen settings menu.
      throw new UnauthorizedException('Account no longer exists.');
    }
    return user;
  }
}
