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

	@Column()
	view!: number;

	@Column({ default: true })
	is_private!: boolean;

	@Column('timestamptz')
	@CreateDateColumn()
	created_at!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updated_at!: Date;

	@ManyToOne(() => User, (user) => user.posts)
	@JoinColumn()
	user!: User;

	@OneToMany(() => Comment, (comment) => comment.posts)
	comments!: Comment[];

	@ManyToOne(() => Category, (category) => category.posts)
	@JoinColumn()
	category!: Category;

	@ManyToMany(() => Tag, (tag) => tag.posts)
	@JoinTable()
	tags!: Tag[];
}
