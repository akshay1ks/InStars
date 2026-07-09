/**
 * users.controller.ts — "me" endpoints, all JWT-protected.
 *
 *   GET    /api/users/me   -> full own profile (Profile tab, Screen 27)
 *   PATCH  /api/users/me   -> save onboarding step / edit profile
 *   DELETE /api/users/me   -> delete account (settings menu)
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Patch('me')
  updateMe(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Delete('me')
  async deleteMe(@CurrentUser() user: User) {
    await this.usersService.deleteAccount(user.id);
    return { message: 'Account deleted' };
  }
}
