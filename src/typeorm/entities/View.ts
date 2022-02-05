import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class View {
	@PrimaryColumn({ default: 1 })
	id!: string;

	@Column()
	today!: number;

	@Column()
	total!: number;
}
