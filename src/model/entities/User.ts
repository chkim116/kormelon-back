import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import { Comment } from './Comment';
import { Post } from './Post';
import { Notification } from './Notification';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	username!: string;

	@Column()
	userImage!: string;

	@Column()
	email!: string;

	@Column()
	password!: string;

	@Column({ default: false })
	isAdmin!: boolean;

	@Column('timestamptz')
	@CreateDateColumn()
	createdAt!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updatedAt!: Date;

	@OneToMany(() => Post, (post) => post.user)
	posts!: Post[];

	@OneToMany(() => Comment, (comment) => comment.user)
	comments!: Comment[];

	@OneToMany(() => Notification, (notification) => notification.user)
	notifications!: Notification[];
}
