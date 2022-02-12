import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class View {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	today!: number;

	@Column()
	total!: number;

	@Column({ type: 'simple-array' })
	ips!: string[];
}
