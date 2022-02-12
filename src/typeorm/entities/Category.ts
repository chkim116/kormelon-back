import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { ParentCategory } from './ParentCategory';
import { Post } from './Post';

@Entity()
export class Category {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	value!: string;

	@OneToMany(() => Post, (post) => post.category)
	posts!: Post[];

	@ManyToOne(
		() => ParentCategory,
		(parentCategory) => parentCategory.categories
	)
	@JoinColumn()
	parent!: ParentCategory;
}
