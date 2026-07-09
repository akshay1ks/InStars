export declare class User {
    id: string;
    /** Indian phone number in E.164 format, e.g. +919876543210. Unique login key. */
    phone: string;
    /** Optional recovery email (Screen 4 — skippable). */
    email: string | null;
    /** Display name (Screen 6/7). Used for initials in the anonymous name. */
    name: string | null;
    /** Sexual orientation (Screens 8-10 — skippable). */
    sexualOrientation: string | null;
    /** Checkbox on Screen 8-10: whether orientation is visible on the profile. */
    showOrientation: boolean;
    /** Who the user is interested in (Screen 11): Men / Women / Everyone. */
    interestedIn: string | null;
    /** Max match distance in km (Screen 12 slider). Editable later in Profile. */
    distanceKm: number;
    /** Nature of relationship the user wants (Screen 13). */
    relationshipType: string | null;
    /** School / college attended (Screen 14 — skippable). */
    school: string | null;
    /**
     * Habits (Screen 15 — skippable). One choice per section, stored as a map:
     * { "Drinking": "Socially", "Smoking": "Never", ... }
     */
    habits: Record<string, string>;
    /** Interests (Screen 16 — up to 10, skippable). */
    interests: string[];
    /** Profile picture URLs (Screen 17 — min 1, max 6). Stored in Supabase Storage. */
    photos: string[];
    /** "About me" free text (Screens 18/19 — skippable). */
    aboutMe: string | null;
    /** Last known device location — used for the distance filter and the
     *  "x km away" label on profile tiles. Updated by the app on Home load. */
    latitude: number | null;
    longitude: number | null;
    /** True once the user finishes (or skips through) the onboarding flow.
     *  The app uses this to decide whether to show onboarding or the tabs. */
    onboardingComplete: boolean;
    createdAt: Date;
    updatedAt: Date;
    /**
     * The anonymous display name shown on profile tiles before a profile is
     * revealed: the word "User" + the initials of the real name.
     * e.g. "Akshay Singh" -> "User AS". Falls back to "User" when no name yet.
     */
    get anonymousName(): string;
}
