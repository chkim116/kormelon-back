import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new aws.S3({
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
	region: 'ap-northeast-2',
});

const multerImg = multer({
	storage: multerS3({
		s3,
		acl: 'public-read',
		bucket: 'assets-kormelon-v2/img',
		key: function (req, file, cb) {
			cb(null, file.originalname); // 이름 설정
		},
	}),
});

export const uploadImage = multerImg.single('image');
