import passport from 'passport';
import userSchema from "../schema/schema.user.ts";

const register = async (req: any, res: any) => {
    try {
        const exist = await userSchema.findOne({ email: req.body.email });
        if (exist) {
          return res.status(400).json({ message: `Email already exists` });
        }
        const newOne = new userSchema(req.body);
        const saved = await newOne.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const signIn = passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
})

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