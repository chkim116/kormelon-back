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
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	title!: string;

	@Column({ type: 'longtext' })
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
		cascade: true,
		eager: true,
	})
	comments!: Comment[];

	@Column('uuid', { name: 'userId' })
	userId!: string;

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
