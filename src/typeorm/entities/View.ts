import { Entity, Column } from 'typeorm';

@Entity()
export class View {
	@Column()
	today!: number;

	@Column()
	total!: number;
}
