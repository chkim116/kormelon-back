import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category';

@Entity()
export class ParentCategory {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	value!: string;

	@OneToMany(() => Category, (category) => category.parent)
	categories!: Category[];
}
