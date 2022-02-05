import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinTable,
	ManyToMany,
} from 'typeorm';
import { Post } from './Post';

@Entity()
export class Tag {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	value!: string;

	@ManyToMany(() => Post, (post) => post.tags)
	@JoinTable()
	posts!: Post[];
}
