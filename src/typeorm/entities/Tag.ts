import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	value!: string;
}
