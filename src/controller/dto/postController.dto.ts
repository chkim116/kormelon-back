import { Tag } from '../../typeorm/entities/Tag';

export interface CreatePostDTO {
	title: string;
	content: string;
	userId: string;
	categoryId: string;
	isPrivate?: boolean;
	tags?: Tag[];
}
