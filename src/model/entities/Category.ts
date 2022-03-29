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

	@OneToMany(() => Post, (post) => post.category, {
		cascade: true,
		eager: true,
	})
	posts!: Post[];

	@Column()
	parentId!: string;

	@ManyToOne(
		() => ParentCategory,
		(parentCategory) => parentCategory.categories,
		{ onDelete: 'CASCADE' }
	)
	@JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
	parent!: ParentCategory;
}
