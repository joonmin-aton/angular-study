import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { JWT_SECRET_KEY } from '../config/config.passport.ts';
import userSchema from "../schema/schema.user.ts";

const register = async (req: any, res: any) => {
    try {
        const exist = await userSchema.findOne({ email: req.body.email });
        if (exist) {
          return res.status(400).json({ message: `Email already exists` });
        }
        const newOne = new userSchema({
            email: req.body.email,
            name: req.body.name,
            password: await bcrypt.hash(req.body.password, 10)
        });
        const saved = await newOne.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const signIn = (req: any, res: any) =>
    passport.authenticate(
        'local', 
        {
            successRedirect: "/",
            failureRedirect: "/login",
        },
        (error: any, user: any) => {
            res.status(200).json({
                code: "0000",
                message: "success",
                data: {
                    accessToken: jwt.sign({
                        id: user?.id,
                    }, JWT_SECRET_KEY, {
                        audience: user?.id,
                        algorithm: "HS256",
                        expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
                    })
                }
            })
        }
    );

const signOut = (req: any, res: any) => {
    //passport 정보 삭제
    req.logout();
    //서버측 세션 삭제
    req.session.destroy(()=>{
        //클라이언트 측 세션 암호화 쿠키 삭제
        res.cookie('connect.sid','',{maxAge:0});
        res.redirect('/');
    });
}

const AuthService = {
    register, signIn, signOut
}

export default AuthService;