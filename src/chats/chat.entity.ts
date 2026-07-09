/**
 * chat.entity.ts — one row per conversation between two users.
 *
 * Conventions used throughout the chat feature:
 *  - `initiator` is the user who tapped "Start" on the Home screen popup
 *    (Screen 22). The other user (`recipient`) sees the conversation in the
 *    "Received chat requests" tab (Screen 26) until they reply — after their
 *    first message the chat moves to their regular Chats tab (Screen 25).
 *  - Profiles are locked by default: users only see each other's anonymous
 *    name + distance. Each side can independently "reveal" their profile
 *    (Screens 23/24), which lets the OTHER person see their real name and
 *    pictures.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** The user who started the chat from the Home screen. */
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'initiatorId' })
  initiator: User;

  @Column()
  initiatorId: string;

  /** The user who received the chat request. */
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column()
  recipientId: string;

  /** True once the recipient has sent at least one message. Controls whether
   *  the chat shows in their "Requests" tab or "Chats" tab. */
  @Column({ default: false })
  recipientReplied: boolean;

  /** initiator revealed THEIR profile to the recipient. */
  @Column({ default: false })
  revealedByInitiator: boolean;

  /** recipient revealed THEIR profile to the initiator. */
  @Column({ default: false })
  revealedByRecipient: boolean;

  /** Pending reveal request: id of the user who asked the other side to
   *  reveal, or null when there is no outstanding request. */
  @Column({ type: 'varchar', nullable: true })
  revealRequestedById: string | null;

  /** Soft-delete flags — "Delete chat" from the long-press menu only hides
   *  the conversation for the user who deleted it. */
  @Column({ default: false })
  deletedByInitiator: boolean;

  @Column({ default: false })
  deletedByRecipient: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
