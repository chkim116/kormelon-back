import { Request, Response } from "express";
import Category from "../models/Category";
import Post, { PostType } from "../models/post";
import Comments from "../models/Comments";
import User, { UserType } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const getAllTitle = async (req: Request, res: Response) => {
    try {
        const post = await Post.find();

        const postTitleList = post.map((lst) => lst.title);
        res.json({ postTitleList });
    } catch (error) {
        console.error(error);
    }
};

export const getPost = async (req: Request, res: Response) => {
    const { filter, page }: any = req.query;
    const pageNumber = parseInt(page || "1");

    if (pageNumber < 1) {
        res.status(400).send("페이지 에러");
        return;
    }
    try {
        const post = await Post.find(
            filter ? { category: decodeURIComponent(filter) } : {}
        )
            .sort({ _id: -1 })
            .limit(6)
            .skip((pageNumber - 1) * 6)
            .exec();
        const postCount = await Post.countDocuments(
            filter ? { category: filter } : {}
        ).exec();
        res.json({ post, postCount });
    } catch (error) {
        console.error(error);
    }
};

export const postPosting = async (req: Request, res: Response) => {
    const {
        body: {
            title,
            preview,
            thumb,
            description,
            updated,
            createDate,
            tags,
            category,
        },
    }: { body: PostType } = req;
    const id = (req.user as UserType)?._id as string;
    try {
        const post = await Post.create({
            title,
            thumb,
            preview,
            description,
            updated,
            createDate,
            creator: id,
            tags: tags,
            category,
        });
        const categories = await Category.find({ category });
        categories[0].post.push(post._id);
        categories[0].save();
        post.save();
        res.json(true);
    } catch (err) {
        console.error(err);
        res.status(400);
        res.json(false);
    }
};

export const getPostById = async (req: Request, res: Response) => {
    const { title } = req.params;
    const isMe = req.cookies.x_auth;

    try {
        const postByTitle = await Post.findOne({
            title: decodeURIComponent(title),
        });
        const nextPost = await Post.findOne({
            _id: { $gt: postByTitle?._id },
        })
            .sort({ _id: 1 })
            .limit(1);
        const prevPost = await Post.findOne({
            _id: { $lt: postByTitle?._id },
        })
            .sort({ _id: -1 })
            .limit(1);

        if (postByTitle && !isMe) {
            const view = postByTitle.views + 1;
            postByTitle.views = view;
            await postByTitle.save();
        }
        const next = nextPost
            ? { id: nextPost?._id, title: encodeURIComponent(nextPost.title) }
            : null;
        const prev = prevPost
            ? { id: prevPost?._id, title: encodeURIComponent(prevPost?.title) }
            : null;
        res.status(200).json({ postByTitle, next, prev });
    } catch (err) {
        console.error(err);
    }
};

export const postEditing = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        title,
        preview,
        description,
        updated,
        tags,
        category,
        thumb,
    }: PostType = req.body;
    try {
        const post = await Post.findOneAndUpdate(
            { _id: id },
            { title, preview, description, updated, tags, category, thumb }
        );
        res.status(200).json(post);
    } catch (err) {
        res.status(400).send(false);
        console.error(err);
    }
};

export const postDeleting = async (req: Request, res: Response) => {
    const { id, category } = req.params;
    try {
        await Post.findOneAndDelete({ _id: id });
        const categories = await Category.find({ category });
        await Category.findOneAndUpdate(
            {
                category,
            },
            {
                post: categories[0].post.filter(
                    (list) => list.toString() !== id
                ),
            }
        );

        res.status(200).send(true);
    } catch (err) {
        res.status(400).send(false);
        console.error(err);
    }
};

export const postComments = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        comment: { comment },
        createDate,
    } = req.body;
    try {
        const post = await Post.findById(id);
        const comments = await Comments.create({
            comment: comment as string,
            creator: req.user ? (req.user as UserType).username : "익명",
            createDate: createDate,
        });
        if (post && comments) {
            post.comment?.push(comments);
            post.save();
            res.status(200).json(comments);
        }
    } catch (err) {
        res.status(400);
        console.error(err);
    }
};

export const delComments = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await Comments.findOneAndDelete({ _id: id });
        res.status(200);
    } catch (err) {
        res.status(400);
        console.error(err);
    }
};

export const postImg = (req: Request, res: Response) => {
    const { file } = req;
    const location = (file as any).location;
    try {
        res.status(200).json(location);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
};
