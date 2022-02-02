import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from './Post';

@Entity()
export class Category {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	value!: string;

	@OneToMany(() => Post, (post) => post.category)
	posts!: Post[];
}
