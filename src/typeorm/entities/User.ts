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

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	username!: string;

	@Column()
	email!: string;

	@Column()
	password!: string;

	@Column({ default: false })
	is_admin!: boolean;

	@Column('timestamptz')
	@CreateDateColumn()
	created_at!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updated_at!: Date;

	@OneToMany(() => Post, (post) => post.user)
	posts!: Post[];

	@OneToMany(() => Comment, (comment) => comment.user)
	comments!: Comment[];
}
