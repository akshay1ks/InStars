export declare class UpdateProfileDto {
    /** Screen 4 — optional recovery email. */
    email?: string;
    /** Screen 6/7 — display name. */
    name?: string;
    /** Screens 8-10 — orientation. */
    sexualOrientation?: string;
    showOrientation?: boolean;
    /** Screen 11 — interested in. */
    interestedIn?: string;
    /** Screen 12 — distance slider (1-500 km). */
    distanceKm?: number;
    /** Screen 13 — nature of relationship. */
    relationshipType?: string;
    /** Screen 14 — school / college. */
    school?: string;
    /** Screen 15 — one habit per section. */
    habits?: Record<string, string>;
    /** Screen 16 — max 10 interests. */
    interests?: string[];
    /** Screen 17 — 1 to 6 photo URLs (uploaded to Supabase Storage by the app). */
    photos?: string[];
    /** Screens 18/19 — about me. */
    aboutMe?: string;
    /** Device GPS position, sent by the app when Home loads. */
    latitude?: number;
    longitude?: number;
    /** Set true by the app on the last onboarding step. */
    onboardingComplete?: boolean;
}
