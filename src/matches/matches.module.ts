/**
 * matches.module.ts — compatible-profiles feature (Home tab).
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../chats/chat.entity';
import { User } from '../users/user.entity';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
