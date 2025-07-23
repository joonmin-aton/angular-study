import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from "../config/config.passport.ts";
import postSchema from "../schema/schema.post.ts";

const writePost = async (req: any, res: any) => {
    try {
        const token = req.headers?.authorization?.replace("Bearer ", "");
        const claims: any = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ["HS256"]});
        if (!claims) {
            res.status(400).json("인증 실패되었습니다");
        }
        const { title, contents, keywords } = req?.body;
        const newOne = new postSchema({
            userId: claims.id,
            title,
            contents,
            keywords,
        });
        const saved = await newOne.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const updatePost = async (req: any, res: any) => {
    try {
        const token = req.headers?.authorization?.replace("Bearer ", "");
        const claims: any = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ["HS256"]});
        if (!claims) {
            res.status(400).json("인증 실패되었습니다");
        }
        const { id, title, contents, keywords } = req?.body;
        const exist = await postSchema.findOne({ _id: id });
        const saved = await exist?.updateOne({
            userId: claims.id,
            title, contents, keywords
        })
        res.status(200).json(saved);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const deletePost = async (req: any, res: any) => {
    try {
        const { id } = req?.body;
        const deleted = await postSchema.findOneAndDelete({ id })
        res.status(200).json(deleted);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const list = async (req: any, res: any) => {
    try {
        const { id, page, size, keyword } = req?.body;
        let query: any = { userId: id };
        if (keyword) {
            query = { userId: id, keywords: { $in: keyword } }
        }
        const list = await postSchema.find({ ...query })
                                .limit(size * 1)
                                .skip((page - 1 ) * size)
                                .sort({ createdAt: -1 });

        const totalCounts : number = await postSchema.countDocuments({ ...query });
        const curPage = page;
        const rowsPerPage = size;
        const pageSize = 5;        // 페이지네이션 길이
        const totalPages = Math.ceil(totalCounts / size);
        const startPage = Math.floor((page-1) / pageSize) * pageSize + 1;
        let endPage = (Math.floor((page-1) / pageSize) + 1) * pageSize;
        if (totalPages < endPage) endPage = totalPages;

        let hasPrev = true;
        let hasNext = true;
        if (startPage === 1) hasPrev = false;
        if (endPage === totalPages) hasNext = false;

        res.status(200).json({
            list,
            pageable: {
                curPage,
                pageSize,
                rowsPerPage,
                totalPages,
                totalCounts,
                startPage,
                endPage,
                hasPrev,
                hasNext,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const detail = async (req: any, res: any) => {
    try {
        const { id } = req?.body;
        const exist = await postSchema.findOne({ id });
        res.status(200).json(exist);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const top5Keywords = async (req: any, res: any) => {
    try {
        const { id } = req?.body;       // blog 아이디
        const exist = await postSchema.aggregate([
            {
                $match: {
                    userId: id,
                }
            },
            {$unwind: "$keywords"},
            {
                $group: {
                    _id: "$keywords",
                    count: {
                        "$sum": 1
                    }
                }
            },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 5 }
        ]);
        res.status(200).json(exist);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const BlogService = {
    writePost,
    updatePost,
    deletePost,
    list,
    detail,
    top5Keywords
}

export default BlogService;