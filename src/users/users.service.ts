/**
 * users.service.ts — profile read/update/delete logic.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Partial update — merges only the fields present in the DTO, so each
   * onboarding screen can save its own slice of the profile independently.
   */
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    Object.assign(user, dto);
    return this.users.save(user);
  }

  /** "Delete account" from the Profile screen's settings menu (Screen 27).
   *  Chats and messages cascade-delete via their foreign keys. */
  async deleteAccount(userId: string): Promise<void> {
    await this.users.delete({ id: userId });
  }
}
