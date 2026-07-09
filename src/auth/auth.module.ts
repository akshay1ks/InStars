/**
 * auth.module.ts — phone OTP authentication.
 *
 * Flow (Screens 1-3):
 *  1. POST /api/auth/send-otp   { phone }        -> Supabase texts an OTP
 *  2. POST /api/auth/verify-otp { phone, token } -> Supabase verifies it,
 *     we create/find the User row and return our own JWT session token.
 *
 * All later requests carry `Authorization: Bearer <token>` and are checked
 * by the JwtStrategy/JwtAuthGuard pair.
 */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '30d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
