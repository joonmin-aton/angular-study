import express from "express";
import postSchema from "../schema/schema.post.ts";
import userSchema from "../schema/schema.user.ts";
import AuthService from "../service/service.auth.ts";
import { RestfulResource } from "../utils/node-restful.ts";
import passport from "passport";

export default (app: any, path: string) => {
    const router = express.Router();
    const API_AUTH = `${path}/auth`;

    // 인증
    // CRUD
    const userResource = new RestfulResource<any>(userSchema);
    userResource.serve(app, `${path}/users`);

    const postResource = new RestfulResource<any>(postSchema);
    postResource.before(['post', 'put', 'delete'], passport.authenticate('jwt'))
    postResource.serve(app, `${path}/posts`);


    // 회원가입
    router.post(`${API_AUTH}/register`, AuthService.register);

    // 로그인
    router.post(
        `${API_AUTH}/signIn`,
        AuthService.signIn
    );

    // 로그아웃
    router.post(`${API_AUTH}/signOut`, AuthService.signOut);

    return router;
};