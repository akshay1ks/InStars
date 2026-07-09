"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
/**
 * auth.service.ts — talks to the Supabase Auth (GoTrue) REST API to send and
 * verify SMS OTPs, and issues the app's own JWT once a phone is verified.
 *
 * Why call Supabase from the server instead of the app?
 *  - The Indian-number rule (+91 only) is enforced in one trusted place.
 *  - The mobile app only ever talks to OUR backend; the Supabase service
 *    role key never ships inside the app binary.
 */
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
/**
 * Indian mobile numbers: +91 followed by 10 digits starting with 6-9.
 * This is the ONLY phone format the app accepts (per the requirements).
 */
const INDIAN_PHONE_REGEX = /^\+91[6-9]\d{9}$/;
let AuthService = class AuthService {
    constructor(config, jwt, users) {
        this.config = config;
        this.jwt = jwt;
        this.users = users;
    }
    /** Normalise "9876543210" / "919876543210" / "+91 98765 43210" to E.164. */
    normalizePhone(raw) {
        const digits = raw.replace(/[^\d]/g, '');
        if (digits.length === 10)
            return `+91${digits}`;
        if (digits.length === 12 && digits.startsWith('91'))
            return `+${digits}`;
        return raw.startsWith('+') ? raw : `+${digits}`;
    }
    /** Throws unless the number is a valid Indian mobile number. */
    assertIndianPhone(phone) {
        if (!INDIAN_PHONE_REGEX.test(phone)) {
            throw new common_1.BadRequestException('Only Indian mobile numbers (+91) are supported.');
        }
    }
    /** Small helper for calling the Supabase Auth REST endpoints. */
    async supabaseAuthRequest(path, body) {
        const url = `${this.config.get('SUPABASE_URL')}/auth/v1/${path}`;
        const serviceKey = this.config.get('SUPABASE_SERVICE_ROLE_KEY');
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
    async sendOtp(rawPhone) {
        const phone = this.normalizePhone(rawPhone);
        this.assertIndianPhone(phone);
        const { ok, json } = await this.supabaseAuthRequest('otp', { phone });
        if (!ok) {
            throw new common_1.BadRequestException(json?.msg || json?.error_description || 'Could not send OTP. Please try again.');
        }
        return { message: 'OTP sent' };
    }
    /**
     * Step 2 (Screen 3): verify the OTP with Supabase. On success, find or
     * create the local User row and return our own signed session token.
     */
    async verifyOtp(rawPhone, token) {
        const phone = this.normalizePhone(rawPhone);
        this.assertIndianPhone(phone);
        const { ok, json } = await this.supabaseAuthRequest('verify', {
            type: 'sms',
            phone,
            token,
        });
        if (!ok) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP.');
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
    publicProfile(user) {
        const { id, phone, email, name, sexualOrientation, showOrientation, interestedIn, distanceKm, relationshipType, school, habits, interests, photos, aboutMe, onboardingComplete } = user;
        return { id, phone, email, name, sexualOrientation, showOrientation,
            interestedIn, distanceKm, relationshipType, school, habits, interests,
            photos, aboutMe, onboardingComplete };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map