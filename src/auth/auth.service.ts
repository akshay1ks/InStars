/**
 * auth.service.ts — talks to the Supabase Auth (GoTrue) REST API to send and
 * verify SMS OTPs, and issues the app's own JWT once a phone is verified.
 *
 * Why call Supabase from the server instead of the app?
 *  - The Indian-number rule (+91 only) is enforced in one trusted place.
 *  - The mobile app only ever talks to OUR backend; the Supabase service
 *    role key never ships inside the app binary.
 */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

/**
 * Indian mobile numbers: +91 followed by 10 digits starting with 6-9.
 * This is the ONLY phone format the app accepts (per the requirements).
 */
const INDIAN_PHONE_REGEX = /^\+91[6-9]\d{9}$/;

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  /** Normalise "9876543210" / "919876543210" / "+91 98765 43210" to E.164. */
  private normalizePhone(raw: string): string {
    const digits = raw.replace(/[^\d]/g, '');
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
    return raw.startsWith('+') ? raw : `+${digits}`;
  }

  /** Throws unless the number is a valid Indian mobile number. */
  private assertIndianPhone(phone: string): void {
    if (!INDIAN_PHONE_REGEX.test(phone)) {
      throw new BadRequestException(
        'Only Indian mobile numbers (+91) are supported.',
      );
    }
  }

  /** Small helper for calling the Supabase Auth REST endpoints. */
  private async supabaseAuthRequest(path: string, body: unknown) {
    const url = `${this.config.get('SUPABASE_URL')}/auth/v1/${path}`;
    const serviceKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, json };
  }

  /**
   * Step 1 (Screens 1-2): validate the number and ask Supabase to text an OTP.
   */
  async sendOtp(rawPhone: string): Promise<{ message: string }> {
    const phone = this.normalizePhone(rawPhone);
    this.assertIndianPhone(phone);

    const { ok, json } = await this.supabaseAuthRequest('otp', { phone });
    if (!ok) {
      throw new BadRequestException(
        (json as any)?.msg || (json as any)?.error_description || 'Could not send OTP. Please try again.',
      );
    }
    return { message: 'OTP sent' };
  }

  /**
   * Step 2 (Screen 3): verify the OTP with Supabase. On success, find or
   * create the local User row and return our own signed session token.
   */
  async verifyOtp(rawPhone: string, token: string) {
    const phone = this.normalizePhone(rawPhone);
    this.assertIndianPhone(phone);

    const { ok, json } = await this.supabaseAuthRequest('verify', {
      type: 'sms',
      phone,
      token,
    });
    if (!ok) {
      throw new UnauthorizedException('Invalid or expired OTP.');
    }

    // First login creates the profile row; later logins reuse it.
    let user = await this.users.findOne({ where: { phone } });
    if (!user) {
      user = this.users.create({ phone });
      user = await this.users.save(user);
    }

    // Our own JWT — the mobile app stores this and sends it on every request.
    const accessToken = await this.jwt.signAsync({ sub: user.id, phone });

    return {
      accessToken,
      user: this.publicProfile(user),
      // Tells the app whether to route to onboarding or straight to Home.
      onboardingComplete: user.onboardingComplete,
    };
  }

  /** Shape of the user object we return to the client (own profile). */
  publicProfile(user: User) {
    const { id, phone, email, name, sexualOrientation, showOrientation,
      interestedIn, distanceKm, relationshipType, school, habits, interests,
      photos, aboutMe, onboardingComplete } = user;
    return { id, phone, email, name, sexualOrientation, showOrientation,
      interestedIn, distanceKm, relationshipType, school, habits, interests,
      photos, aboutMe, onboardingComplete };
  }
}
