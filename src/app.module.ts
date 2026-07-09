/**
 * app.module.ts — root module.
 *
 * Wires together:
 *  - ConfigModule: loads .env (locally) / Railway variables (in production).
 *  - TypeOrmModule: connects to the Supabase Postgres database using the
 *    "Direct connection" string (DATABASE_URL).
 *  - Feature modules: Auth (OTP login), Users (profile), Matches
 *    (compatible profiles), Chats (messaging + reveal profile).
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MatchesModule } from './matches/matches.module';
import { ChatsModule } from './chats/chats.module';
import { User } from './users/user.entity';
import { Chat } from './chats/chat.entity';
import { Message } from './chats/message.entity';

@Module({
  imports: [
    // isGlobal makes ConfigService injectable everywhere without re-importing.
    ConfigModule.forRoot({ isGlobal: true }),

    // Database connection. We use the async factory so the DATABASE_URL is
    // read after the ConfigModule has loaded the environment.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        // Supabase requires SSL; rejectUnauthorized=false accepts their
        // managed certificate chain.
        ssl: { rejectUnauthorized: false },
        entities: [User, Chat, Message],
        // synchronize=true auto-creates/updates tables from the entities.
        // Perfect for development. For a serious production launch switch
        // to TypeORM migrations and set this to false.
        synchronize: true,
      }),
    }),

    AuthModule,
    UsersModule,
    MatchesModule,
    ChatsModule,
  ],
})
export class AppModule {}
