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

	@Column({ default: false })
	has_replies!: boolean;

	@Column('timestamptz')
	@CreateDateColumn()
	created_at!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updated_at!: Date;

	@ManyToOne(() => User, (user) => user.comments)
	@JoinColumn()
	user!: User;

	@ManyToOne(() => Post, (post) => post.comments)
	@JoinColumn()
	posts!: Post;

	@OneToMany(() => CommentReply, (reply) => reply.parent_comment)
	@JoinColumn()
	reply_comments!: Comment[];
}