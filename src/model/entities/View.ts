import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class View {
	@PrimaryColumn()
	id!: string;

	@Column()
	today!: number;

	@Column()
	total!: number;
}
