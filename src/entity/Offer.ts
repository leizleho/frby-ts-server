import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { User } from './User';

@Entity('offer')
export class Offer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 255 })
  description: string;

  @Column('varchar', { length: 100 })
  category: string;

  @Column('double precision') latitude: number;

  @Column('double precision') longitude: number;

  @Column('text') pictureUrl: string;

  @Column('boolean', { default: false })
  available: boolean;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, user => user.offers)
  user: User;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
