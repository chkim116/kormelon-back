import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { Category } from './Category';
import { Comment } from './Comment';
import { Tag } from './Tag';
import { User } from './User';

@Entity()
export class Post {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	title!: string;

	@Column()
	content!: string;

	@Column({ default: 0 })
	view!: number;

	@Column({ default: false })
	is_private!: boolean;

	@Column('timestamptz')
	@CreateDateColumn()
	created_at!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updated_at!: Date;

	@OneToMany(() => Comment, (comment) => comment.posts)
	comments!: Comment[];

	@Column('uuid', { name: 'userId' })
	userId!: string;

	@ManyToOne(() => User, (user) => user.posts, {
		cascade: ['insert'],
	})
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: User;

	@Column('uuid', { name: 'categoryId' })
	categoryId!: string;

	@ManyToOne(() => Category, (category) => category.posts, {
		cascade: ['insert'],
	})
	@JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
	category!: Category;

	@ManyToMany(() => Tag, (tag) => tag.posts)
	@JoinTable()
	tags!: Tag[];
}
