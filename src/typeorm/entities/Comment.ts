import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	UpdateDateColumn,
	JoinColumn,
	OneToMany,
} from 'typeorm';
import { CommentReply } from './CommentReply';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	text!: string;

	@OneToMany(() => CommentReply, (commentReply) => commentReply.parent)
	commentReplies!: CommentReply[];

	@Column('timestamptz')
	@CreateDateColumn()
	createdAt!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updatedAt!: Date;

	@Column('date', { default: null })
	deletedAt!: Date | null;

	@ManyToOne(() => User, (user) => user.comments)
	@JoinColumn()
	user!: User;

	@Column()
	username!: string;

	@Column()
	password!: string;

	@ManyToOne(() => Post, (post) => post.comments)
	post!: Post;
}
