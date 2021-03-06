/**
 * tags와 category는 string으로 value를 받는다.
 * controller에서 Entity 형식으로 변환할 예정.
 */
import { Post } from '../../model/entities/Post';

export interface CreatePostDTO extends Omit<Post, 'tags' | 'category'> {
	title: string;
	content: string;
	isPrivate: boolean;
	// string, not entity
	parentCategory: string;
	category: string;
	tags: string[];
}
