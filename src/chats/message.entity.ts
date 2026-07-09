/**
 * message.entity.ts — a single chat message.
 *
 * `read` powers the red unread-count badges on the Chats (Screen 25) and
 * Requests (Screen 26) tabs. Messages are marked read when the recipient
 * opens the conversation.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../users/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Index()
  @Column()
  chatId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column()
  senderId: string;

  /** Message body. Plain text for now. */
  @Column({ type: 'text' })
  content: string;

  /** True once the other participant has opened the chat after this message. */
  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
