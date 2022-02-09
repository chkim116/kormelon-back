import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	UpdateDateColumn,
	JoinColumn,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	text!: string;

	@Column({ type: 'simple-array', default: null })
	commentReplies!: Omit<Comment, 'commentReplies'>[] | null;

	@Column('timestamptz')
	@CreateDateColumn()
	createdAt!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updatedAt!: Date;

	@ManyToOne(() => User, (user) => user.comments)
	@JoinColumn()
	user!: User;

	@ManyToOne(() => Post, (post) => post.comments)
	post!: Post;
}
