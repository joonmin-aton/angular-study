import postSchema from "../schema/schema.post.ts";

const writePost = async (req: any, res: any) => {
    try {
        const { title, contents, keywords } = req?.body;
        const newOne = new postSchema({
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
        const { id, title, contents, keywords } = req?.body;
        const exist = await postSchema.findOne({ id });
        const saved = await exist?.updateOne({
            ...exist,
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
        const { page, size } = req?.body;
        const list = await postSchema.find()
                                .limit(size * 1)
                                .skip((page - 1 ) * size)
                                .sort({ createdAt: -1 });

        const totalCounts : number = await postSchema.countDocuments();
        const curPage = page;
        const rowsPerPage = size;
        const pageSize = 5;        // 페이지네이션 길이
        console.log((page-1) / pageSize);
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

const BlogService = {
    writePost,
    updatePost,
    deletePost,
    list,
    detail
}

export default BlogService;