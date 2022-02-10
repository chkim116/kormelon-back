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

	@Column('timestamptz')
	@CreateDateColumn()
	createdAt!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updatedAt!: Date;

	@ManyToOne(() => User, (user) => user.comments)
	@JoinColumn()
	user!: User;
}
