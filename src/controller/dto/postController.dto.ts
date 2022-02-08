import { Post } from '../../typeorm/entities/Post';

export interface CreatePostDTO extends Omit<Post, 'tags'> {
	title: string;
	content: string;
	userId: string;
	categoryId: string;
	isPrivate: boolean;
	tags: string[];
}
