/**
 * update-profile.dto.ts — one flexible DTO used by every onboarding screen
 * AND by the Profile tab's edit feature. Every field is optional; the app
 * sends only the field(s) the current screen collected.
 */
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProfileDto {
  /** Screen 4 — optional recovery email. */
  @IsOptional()
  @IsEmail()
  email?: string;

  /** Screen 6/7 — display name. */
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  /** Screens 8-10 — orientation. */
  @IsOptional()
  @IsString()
  sexualOrientation?: string;

  @IsOptional()
  @IsBoolean()
  showOrientation?: boolean;

  /** Screen 11 — interested in. */
  @IsOptional()
  @IsIn(['Men', 'Women', 'Everyone'])
  interestedIn?: string;

  /** Screen 12 — distance slider (1-500 km). */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  distanceKm?: number;

  /** Screen 13 — nature of relationship. */
  @IsOptional()
  @IsString()
  relationshipType?: string;

  /** Screen 14 — school / college. */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  school?: string;

  /** Screen 15 — one habit per section. */
  @IsOptional()
  @IsObject()
  habits?: Record<string, string>;

  /** Screen 16 — max 10 interests. */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  interests?: string[];

  /** Screen 17 — 1 to 6 photo URLs (uploaded to Supabase Storage by the app). */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  photos?: string[];

  /** Screens 18/19 — about me. */
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  aboutMe?: string;

  /** Device GPS position, sent by the app when Home loads. */
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  /** Set true by the app on the last onboarding step. */
  @IsOptional()
  @IsBoolean()
  onboardingComplete?: boolean;
}
