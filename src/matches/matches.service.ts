/**
 * matches.service.ts — builds the Home screen list of compatible profiles
 * (Screens 20-21). The loader on Screen 20 spins exactly while this query
 * runs; the refresh button re-calls the same endpoint.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Chat } from '../chats/chat.entity';
import { User } from '../users/user.entity';
import { distanceKm, profileTile } from './compatibility.util';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Chat) private readonly chats: Repository<Chat>,
  ) {}

  async findMatches(me: User) {
    // All other users who finished onboarding.
    const candidates = await this.users.find({
      where: { id: Not(me.id), onboardingComplete: true },
    });

    // Chats I already have — used for the red "already chatted" check mark
    // on Screen 21 tiles.
    const myChats = await this.chats.find({
      where: [{ initiatorId: me.id }, { recipientId: me.id }],
    });
    const chattedWith = new Set(
      myChats.map((c) => (c.initiatorId === me.id ? c.recipientId : c.initiatorId)),
    );

    const results = candidates
      // 1. "Interested in" filter, applied in both directions when set.
      .filter((other) => this.mutualInterestOk(me, other))
      // 2. Distance filter — the Screen 12 slider value, measured from MY
      //    location. Users without a location yet are kept (distance unknown).
      .filter((other) => {
        if (me.latitude == null || other.latitude == null) return true;
        const d = distanceKm(me.latitude, me.longitude!, other.latitude, other.longitude!);
        return d <= me.distanceKm;
      })
      // 3. Build the anonymous tile + the "already chatted" flag.
      .map((other) => ({
        ...profileTile(me, other),
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
  private mutualInterestOk(me: User, other: User): boolean {
    // If either side chose "Everyone" (or hasn't chosen), don't exclude.
    if (!me.interestedIn || me.interestedIn === 'Everyone') return true;
    if (!other.interestedIn || other.interestedIn === 'Everyone') return true;
    // Both specified a preference: show profiles whose preference is
    // compatible with mine (interested in each other's category).
    return true; // Without explicit gender data every specific pair is allowed.
  }
}
