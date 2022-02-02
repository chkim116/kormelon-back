import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

	@OneToMany(() => Post, (post) => post.user)
	posts!: Post[];

	@OneToMany(() => Comment, (comment) => comment.user)
	comments!: Comment[];
}
