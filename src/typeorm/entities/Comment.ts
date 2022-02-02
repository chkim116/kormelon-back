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

	@Column({ default: false })
	has_replies!: boolean;

	@Column()
	replie_comments!: Comment[];

	@Column('timestamptz')
	@CreateDateColumn()
	created_at!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updated_at!: Date;

	@ManyToOne(() => User, (user) => user.comments)
	@JoinColumn({ name: 'fk_user_id' })
	user!: User;

	@ManyToOne(() => Post, (post) => post.comments)
	@JoinColumn({ name: 'fk_post_id' })
	posts!: Post;
}
