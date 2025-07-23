import jwt from 'jsonwebtoken';
import userSchema from "../schema/schema.user.ts";
import { JWT_SECRET_KEY } from '../config/config.passport.ts';

const info = async (req: any, res: any) => {
    try {
        const token = req.headers?.authorization?.replace("Bearer ", "");
        const claims: any = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ["HS256"]});
        if (!claims) {
            res.status(400).json("인증 실패되었습니다");
        }
        const exist = await userSchema.findOne({ _id: claims.id });
        res.status(200).json(exist);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const UserService = {
    info
}

export default UserService;