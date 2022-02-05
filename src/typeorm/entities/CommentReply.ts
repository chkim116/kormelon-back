import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	UpdateDateColumn,
	JoinColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';

@Entity()
export class CommentReply {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	text!: string;

	@ManyToOne(() => Comment)
	parent_comment!: Comment;

	@Column('timestamptz')
	@CreateDateColumn()
	created_at!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updated_at!: Date;

	@ManyToOne(() => User, (user) => user.comments)
	@JoinColumn()
	user!: User;
}
