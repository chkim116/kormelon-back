import mongoose, { Document } from "mongoose"
import { CommentType } from "./Comments"

export interface PostType extends Document {
    _id?: string
    title: string
    thumb: string
    views: number
    preview: string
    description: string
    createDate: string
    updated: string
    creator: string
    tags: string[]
    category: string
    comment?: CommentType[]
}

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "title is required",
    },
    preview: {
        type: String,
    },
    thumb: {
        type: String,
    },
    views: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: "description is required",
    },
    createDate: String,
    updated: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    tags: Array,
    category: {
        type: String,
    },
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments",
        },
    ],
})

const model = mongoose.model<PostType>("Post", PostSchema)

export default model
