import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class AuthService {
    private readonly config;
    private readonly jwt;
    private readonly users;
    constructor(config: ConfigService, jwt: JwtService, users: Repository<User>);
    /** Normalise "9876543210" / "919876543210" / "+91 98765 43210" to E.164. */
    private normalizePhone;
    /** Throws unless the number is a valid Indian mobile number. */
    private assertIndianPhone;
    /** Small helper for calling the Supabase Auth REST endpoints. */
    private supabaseAuthRequest;
    /**
     * Step 1 (Screens 1-2): validate the number and ask Supabase to text an OTP.
     */
    sendOtp(rawPhone: string): Promise<{
        message: string;
    }>;
    /**
     * Step 2 (Screen 3): verify the OTP with Supabase. On success, find or
     * create the local User row and return our own signed session token.
     */
    verifyOtp(rawPhone: string, token: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            phone: string;
            email: string | null;
            name: string | null;
            sexualOrientation: string | null;
            showOrientation: boolean;
            interestedIn: string | null;
            distanceKm: number;
            relationshipType: string | null;
            school: string | null;
            habits: Record<string, string>;
            interests: string[];
            photos: string[];
            aboutMe: string | null;
            onboardingComplete: boolean;
        };
        onboardingComplete: boolean;
    }>;
    /** Shape of the user object we return to the client (own profile). */
    publicProfile(user: User): {
        id: string;
        phone: string;
        email: string | null;
        name: string | null;
        sexualOrientation: string | null;
        showOrientation: boolean;
        interestedIn: string | null;
        distanceKm: number;
        relationshipType: string | null;
        school: string | null;
        habits: Record<string, string>;
        interests: string[];
        photos: string[];
        aboutMe: string | null;
        onboardingComplete: boolean;
    };
}
