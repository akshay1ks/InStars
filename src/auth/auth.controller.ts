/**
 * auth.controller.ts — the two public (unauthenticated) endpoints of the API.
 */
import { Body, Controller, Post } from '@nestjs/common';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { AuthService } from './auth.service';

class SendOtpDto {
  /** Phone number as typed by the user; the service normalises it to +91… */
  @IsString()
  @IsNotEmpty()
  phone: string;
}

class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  /** The 6-digit code received via SMS. */
  @IsString()
  @Length(4, 8)
  token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /** Screen 1/2: "Sign in" button -> send the OTP. */
  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.auth.sendOtp(dto.phone);
  }

  /** Screen 3: "Verify OTP" button -> verify and create a session. */
  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.phone, dto.token);
  }
}
