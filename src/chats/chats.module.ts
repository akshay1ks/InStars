/**
 * chats.module.ts — chat feature wiring (REST controller + Socket.IO gateway).
 * Imports AuthModule to reuse the configured JwtService for socket auth.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, User]), AuthModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
