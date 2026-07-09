import { AuthService } from './auth.service';
declare class SendOtpDto {
    /** Phone number as typed by the user; the service normalises it to +91… */
    phone: string;
}
declare class VerifyOtpDto {
    phone: string;
    /** The 6-digit code received via SMS. */
    token: string;
}
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    /** Screen 1/2: "Sign in" button -> send the OTP. */
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
    }>;
    /** Screen 3: "Verify OTP" button -> verify and create a session. */
    verifyOtp(dto: VerifyOtpDto): Promise<{
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
}
export {};
