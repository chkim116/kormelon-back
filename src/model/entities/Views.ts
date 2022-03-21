import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Views {
	@PrimaryColumn()
	id!: number;

	@Column()
	today!: number;

	@Column()
	total!: number;

	@Column({ type: 'simple-array' })
	ips!: string[];
}
