/**
 * user.entity.ts — the single source of truth for a user's profile.
 *
 * Every piece of data collected during the onboarding flow (Screens 4-19 of
 * the requirements doc) is stored here, plus the user's last known location
 * which is used for the distance filter on the Home screen.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Indian phone number in E.164 format, e.g. +919876543210. Unique login key. */
  @Column({ unique: true })
  phone: string;

  /** Optional recovery email (Screen 4 — skippable). */
  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  /** Display name (Screen 6/7). Used for initials in the anonymous name. */
  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  /** Sexual orientation (Screens 8-10 — skippable). */
  @Column({ type: 'varchar', nullable: true })
  sexualOrientation: string | null;

  /** Checkbox on Screen 8-10: whether orientation is visible on the profile. */
  @Column({ default: true })
  showOrientation: boolean;

  /** Who the user is interested in (Screen 11): Men / Women / Everyone. */
  @Column({ type: 'varchar', nullable: true })
  interestedIn: string | null;

  /** Max match distance in km (Screen 12 slider). Editable later in Profile. */
  @Column({ type: 'int', default: 50 })
  distanceKm: number;

  /** Nature of relationship the user wants (Screen 13). */
  @Column({ type: 'varchar', nullable: true })
  relationshipType: string | null;

  /** School / college attended (Screen 14 — skippable). */
  @Column({ type: 'varchar', nullable: true })
  school: string | null;

  /**
   * Habits (Screen 15 — skippable). One choice per section, stored as a map:
   * { "Drinking": "Socially", "Smoking": "Never", ... }
   */
  @Column({ type: 'jsonb', default: {} })
  habits: Record<string, string>;

  /** Interests (Screen 16 — up to 10, skippable). */
  @Column({ type: 'text', array: true, default: [] })
  interests: string[];

  /** Profile picture URLs (Screen 17 — min 1, max 6). Stored in Supabase Storage. */
  @Column({ type: 'text', array: true, default: [] })
  photos: string[];

  /** "About me" free text (Screens 18/19 — skippable). */
  @Column({ type: 'text', nullable: true })
  aboutMe: string | null;

  /** Last known device location — used for the distance filter and the
   *  "x km away" label on profile tiles. Updated by the app on Home load. */
  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  /** True once the user finishes (or skips through) the onboarding flow.
   *  The app uses this to decide whether to show onboarding or the tabs. */
  @Column({ default: false })
  onboardingComplete: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * The anonymous display name shown on profile tiles before a profile is
   * revealed: the word "User" + the initials of the real name.
   * e.g. "Akshay Singh" -> "User AS". Falls back to "User" when no name yet.
   */
  get anonymousName(): string {
    if (!this.name) return 'User';
    const initials = this.name
      .trim()
      .split(/\s+/)
      .map((part) => part[0]!.toUpperCase())
      .join('');
    return `User ${initials}`;
  }
}
