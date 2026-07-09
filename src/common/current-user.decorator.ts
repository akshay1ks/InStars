/**
 * current-user.decorator.ts — small convenience decorator.
 *
 * Usage in a controller:  myRoute(@CurrentUser() user: User) { ... }
 * Returns the User entity that JwtStrategy.validate() attached to the request.
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
