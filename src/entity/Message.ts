import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { User } from './User';
import { Offer } from './Offer';

@Entity('messages')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('text') text: string;

  @Column('uuid') userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column('uuid') offerId: string;

  @ManyToOne(() => Offer)
  offer: Offer;
}
