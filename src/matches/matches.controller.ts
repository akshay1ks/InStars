/**
 * matches.controller.ts
 *
 *   GET /api/matches -> the Home screen list (Screen 21).
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/user.entity';
import { MatchesService } from './matches.service';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matches: MatchesService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.matches.findMatches(user);
  }
}
