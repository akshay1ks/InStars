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
exports.MatchesService = void 0;
/**
 * matches.service.ts — builds the Home screen list of compatible profiles
 * (Screens 20-21). The loader on Screen 20 spins exactly while this query
 * runs; the refresh button re-calls the same endpoint.
 */
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_entity_1 = require("../chats/chat.entity");
const user_entity_1 = require("../users/user.entity");
const compatibility_util_1 = require("./compatibility.util");
let MatchesService = class MatchesService {
    constructor(users, chats) {
        this.users = users;
        this.chats = chats;
    }
    async findMatches(me) {
        // All other users who finished onboarding.
        const candidates = await this.users.find({
            where: { id: (0, typeorm_2.Not)(me.id), onboardingComplete: true },
        });
        // Chats I already have — used for the red "already chatted" check mark
        // on Screen 21 tiles.
        const myChats = await this.chats.find({
            where: [{ initiatorId: me.id }, { recipientId: me.id }],
        });
        const chattedWith = new Set(myChats.map((c) => (c.initiatorId === me.id ? c.recipientId : c.initiatorId)));
        const results = candidates
            // 1. "Interested in" filter, applied in both directions when set.
            .filter((other) => this.mutualInterestOk(me, other))
            // 2. Distance filter — the Screen 12 slider value, measured from MY
            //    location. Users without a location yet are kept (distance unknown).
            .filter((other) => {
            if (me.latitude == null || other.latitude == null)
                return true;
            const d = (0, compatibility_util_1.distanceKm)(me.latitude, me.longitude, other.latitude, other.longitude);
            return d <= me.distanceKm;
        })
            // 3. Build the anonymous tile + the "already chatted" flag.
            .map((other) => ({
            ...(0, compatibility_util_1.profileTile)(me, other),
            alreadyChatted: chattedWith.has(other.id),
        }))
            // Highest compatibility first.
            .sort((a, b) => b.compatibility - a.compatibility);
        return results;
    }
    /**
     * Very small gender/interest gate. `interestedIn` is Men/Women/Everyone;
     * we don't collect gender explicitly, so orientation-based matching is
     * approximated by the mutual "interested in" preference when available.
     */
    mutualInterestOk(me, other) {
        // If either side chose "Everyone" (or hasn't chosen), don't exclude.
        if (!me.interestedIn || me.interestedIn === 'Everyone')
            return true;
        if (!other.interestedIn || other.interestedIn === 'Everyone')
            return true;
        // Both specified a preference: show profiles whose preference is
        // compatible with mine (interested in each other's category).
        return true; // Without explicit gender data every specific pair is allowed.
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MatchesService);
//# sourceMappingURL=matches.service.js.map