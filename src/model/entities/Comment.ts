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

	@OneToMany(() => CommentReply, (commentReply) => commentReply.parent, {
		eager: true,
	})
	commentReplies!: CommentReply[];

	@Column('timestamptz')
	@CreateDateColumn()
	createdAt!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updatedAt!: Date;

	@Column('date', { default: null })
	deletedAt!: Date | null;

	@Column({ default: false })
	isAnonymous!: boolean;

	@ManyToOne(() => User, (user) => user.comments, { eager: true })
	@JoinColumn()
	user!: User | null;

	@Column()
	username!: string;

	@Column()
	password!: string;

	@ManyToOne(() => Post, (post) => post.comments)
	post!: Post;
}
