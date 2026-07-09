/**
 * compatibility.util.ts — shared helpers for the Home / Chats / Requests
 * lists: distance between two users and the compatibility percentage shown
 * on the right of every profile row tile (Screens 21, 25, 26).
 */
import { User } from '../users/user.entity';
/**
 * Great-circle distance between two coordinates in kilometres (Haversine).
 * Used both to FILTER matches (Screen 12 slider) and to LABEL tiles
 * ("3.2 km away").
 */
export declare function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number;
/**
 * Compatibility % — "calculated by comparing the criteria other user has
 * selected in their profile to the criteria which current user has selected"
 * (requirements doc, Screen 21).
 *
 * Each criterion contributes a weighted score; the result is rounded to a
 * whole percentage. Criteria neither user filled in are skipped so a sparse
 * profile is not unfairly punished.
 */
export declare function compatibilityPercent(me: User, other: User): number;
/**
 * The anonymised tile payload used everywhere a profile row is rendered.
 * Real name/photos are only included when `revealed` is true (Screen 25:
 * revealed chats show the actual picture and name).
 */
export declare function profileTile(me: User, other: User, opts?: {
    revealed?: boolean;
}): {
    userId: string;
    anonymousName: string;
    distanceKm: number | null;
    compatibility: number;
    revealed: boolean;
    name: string | null;
    photo: string | null;
};
