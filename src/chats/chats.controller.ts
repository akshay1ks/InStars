/**
 * chats.controller.ts — REST surface of the chat feature.
 *
 *   POST   /api/chats/start            { userId }  -> start/resume a chat
 *   GET    /api/chats                              -> Chats tab list
 *   GET    /api/chats/requests                     -> Requests tab list
 *   GET    /api/chats/:id                          -> history + header info
 *   POST   /api/chats/:id/messages     { content } -> send a message
 *   POST   /api/chats/:id/reveal-request           -> ask other user to reveal
 *   POST   /api/chats/:id/reveal-approve           -> reveal MY profile
 *   GET    /api/chats/:id/revealed-profile         -> other user's profile
 *   DELETE /api/chats/:id                          -> delete chat (for me)
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/user.entity';
import { ChatsService } from './chats.service';

class StartChatDto {
  @IsUUID()
  userId: string;
}

class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post('start')
  start(@CurrentUser() me: User, @Body() dto: StartChatDto) {
    return this.chatsService.startChat(me, dto.userId);
  }

  @Get()
  listChats(@CurrentUser() me: User) {
    return this.chatsService.listChats(me);
  }

  @Get('requests')
  listRequests(@CurrentUser() me: User) {
    return this.chatsService.listRequests(me);
  }

  @Get(':id')
  detail(@Param('id') id: string, @CurrentUser() me: User) {
    return this.chatsService.getChatDetail(id, me);
  }

  @Post(':id/messages')
  send(
    @Param('id') id: string,
    @CurrentUser() me: User,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatsService.sendMessage(id, me, dto.content);
  }

  @Post(':id/reveal-request')
  requestReveal(@Param('id') id: string, @CurrentUser() me: User) {
    return this.chatsService.requestReveal(id, me);
  }

  @Post(':id/reveal-approve')
  approveReveal(@Param('id') id: string, @CurrentUser() me: User) {
    return this.chatsService.approveReveal(id, me);
  }

  @Get(':id/revealed-profile')
  revealedProfile(@Param('id') id: string, @CurrentUser() me: User) {
    return this.chatsService.getRevealedProfile(id, me);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() me: User) {
    return this.chatsService.deleteChat(id, me);
  }
}
