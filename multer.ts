import multer from "multer"
import multerS3 from "multer-s3"
import aws from "aws-sdk"
import dotenv from "dotenv"

dotenv.config()

const s3 = new aws.S3({
    secretAccessKey: process.env.AMAZONE_PASSWORD || "",
    accessKeyId: process.env.AMAZONE_ACCESS_KEY || "",
    region: "ap-northeast-2",
})

const multerImg = multer({
    storage: multerS3({
        s3,
        acl: "public-read",
        bucket: "assets-kormelon/img",
        key: function (req, file, cb) {
            cb(null, file.originalname) // 이름 설정
        },
    }),
})

// const multerImg = multer({ dest: "uploads/" });

export const uploadImage = multerImg.single("image")
