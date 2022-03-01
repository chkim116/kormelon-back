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

	@Column({ type: 'text' })
	content!: string;

	@Column({ default: 0 })
	view!: number;

	@Column({ default: false })
	isPrivate!: boolean;

	@Column('timestamptz')
	@CreateDateColumn()
	createdAt!: Date;

	@Column('timestamptz')
	@UpdateDateColumn()
	updatedAt!: Date;

	@OneToMany(() => Comment, (comment) => comment.post, {
		eager: true,
	})
	comments!: Comment[];

	@ManyToOne(() => User, (user) => user.posts, {
		cascade: ['insert'],
	})
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: User;

	@ManyToOne(() => Category, (category) => category.posts)
	@JoinColumn()
	category!: Category;

	@ManyToMany(() => Tag, (tag) => tag.posts, {
		cascade: true,
	})
	@JoinTable()
	tags!: Tag[];
}
