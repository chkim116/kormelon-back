import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { Post } from './Post';

@Entity()
export class Tag {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	value!: string;

	@ManyToMany(() => Post, (post) => post.tags)
	@JoinTable({
		name: 'post_tags',
		joinColumn: { name: 'fk_post_id' },
		inverseJoinColumn: { name: 'fk_tag_id' },
	})
	posts!: Post[];
}
