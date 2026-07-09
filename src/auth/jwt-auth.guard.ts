/**
 * jwt-auth.guard.ts — apply with @UseGuards(JwtAuthGuard) to require a valid
 * session token. Thin wrapper over the passport 'jwt' strategy.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
