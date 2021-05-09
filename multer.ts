import multer from "multer"
import multerS3 from "multer-s3"
import aws from "aws-sdk"
import dotenv from "dotenv"

dotenv.config()

const s3 = new aws.S3({
    secretAccessKey: process.env.AMAZONE_PASSWORD,
    accessKeyId: process.env.AMAZONE_ACCESS_KEY,
    region: "ap-northeast-2",
})

const multerImg = multer({
    storage: multerS3({
        s3,
        acl: "public-read",
        bucket: "kormelon.cf/myblog",
    }),
})

// const multerImg = multer({ dest: "uploads/" });

export const uploadImage = multerImg.single("image")
