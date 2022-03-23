import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Notification {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	type!: 'post' | 'comment';

	@Column()
	targetId!: string;

	@Column()
	targetValue!: string;

	@Column()
	author!: string;

	@Column()
	value!: string;

	@Column({ default: false })
	isRead!: boolean;

	@Column('timestamptz')
	@CreateDateColumn()
	createdAt!: Date;

	@ManyToOne(() => User, (user) => user.notifications, {
		cascade: true,
	})
	user!: User | null;
}
