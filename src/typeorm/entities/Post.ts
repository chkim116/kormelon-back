import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	ManyToMany,
	JoinColumn,
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

	@Column({ type: 'simple-array' })
	tags!: Tag[];

	@Column('timestamptz')
	@CreateDateColumn()
	created_at!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updated_at!: Date;

	@ManyToOne(() => User, (user) => user.posts)
	@JoinColumn({ name: 'fk_user_id' })
	user!: User;

	@OneToMany(() => Comment, (comment) => comment.posts)
	comments!: Comment[];

	@ManyToOne(() => Category, (category) => category.posts)
	@JoinColumn({ name: 'fk_category_id' })
	category!: Category;
}
