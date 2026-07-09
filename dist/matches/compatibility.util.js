"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distanceKm = distanceKm;
exports.compatibilityPercent = compatibilityPercent;
exports.profileTile = profileTile;
/**
 * Great-circle distance between two coordinates in kilometres (Haversine).
 * Used both to FILTER matches (Screen 12 slider) and to LABEL tiles
 * ("3.2 km away").
 */
function distanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
/**
 * Compatibility % — "calculated by comparing the criteria other user has
 * selected in their profile to the criteria which current user has selected"
 * (requirements doc, Screen 21).
 *
 * Each criterion contributes a weighted score; the result is rounded to a
 * whole percentage. Criteria neither user filled in are skipped so a sparse
 * profile is not unfairly punished.
 */
function compatibilityPercent(me, other) {
    let earned = 0;
    let possible = 0;
    // Relationship type (weight 30): both want the same kind of relationship.
    if (me.relationshipType && other.relationshipType) {
        possible += 30;
        if (me.relationshipType === other.relationshipType)
            earned += 30;
    }
    // Interests overlap (weight 40): Jaccard-style overlap of the two sets.
    if (me.interests?.length && other.interests?.length) {
        possible += 40;
        const mine = new Set(me.interests);
        const shared = other.interests.filter((i) => mine.has(i)).length;
        const union = new Set([...me.interests, ...other.interests]).size;
        earned += (shared / union) * 40;
    }
    // Habits (weight 20): fraction of shared habit sections with the same answer.
    const myHabits = me.habits || {};
    const otherHabits = other.habits || {};
    const sections = Object.keys(myHabits).filter((k) => k in otherHabits);
    if (sections.length) {
        possible += 20;
        const same = sections.filter((k) => myHabits[k] === otherHabits[k]).length;
        earned += (same / sections.length) * 20;
    }
    // School (weight 10): a nice icebreaker when it matches.
    if (me.school && other.school) {
        possible += 10;
        if (me.school.trim().toLowerCase() === other.school.trim().toLowerCase()) {
            earned += 10;
        }
    }
    // No comparable criteria at all -> neutral 50%.
    if (possible === 0)
        return 50;
    return Math.round((earned / possible) * 100);
}
/**
 * The anonymised tile payload used everywhere a profile row is rendered.
 * Real name/photos are only included when `revealed` is true (Screen 25:
 * revealed chats show the actual picture and name).
 */
function profileTile(me, other, opts = {}) {
    const dist = me.latitude != null && other.latitude != null
        ? distanceKm(me.latitude, me.longitude, other.latitude, other.longitude)
        : null;
    return {
        userId: other.id,
        anonymousName: other.anonymousName,
        distanceKm: dist != null ? Math.round(dist * 10) / 10 : null,
        compatibility: compatibilityPercent(me, other),
        revealed: !!opts.revealed,
        // Only expose identifying data once the OTHER user pressed "Reveal profile".
        name: opts.revealed ? other.name : null,
        photo: opts.revealed ? other.photos?.[0] ?? null : null,
    };
}
//# sourceMappingURL=compatibility.util.js.map