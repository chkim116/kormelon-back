import {
	Entity,
	ManyToOne,
	JoinColumn,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';

@Entity()
export class CommentReply {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	text!: string;

	@ManyToOne(() => Comment, (comment) => comment.commentReplies)
	@JoinColumn()
	parent!: Comment;

	@Column()
	username!: string;

	@Column()
	password!: string;

	@Column('timestamptz')
	@CreateDateColumn()
	createdAt!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updatedAt!: Date;

	@Column({ default: false })
	isAnonymous!: boolean;

	@ManyToOne(() => User, (user) => user.comments, { eager: true })
	@JoinColumn()
	user!: User | null;
}
