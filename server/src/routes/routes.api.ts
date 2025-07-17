import express from "express";
import userSchema from "../schema/schema.user.ts";
import postSchema from "../schema/schema.post.ts";
import RestfulUtil from "../utils/util.restful.ts";
import AuthService from "../service/service.auth.ts";

const API_AUTH = "/auth";
const router = express.Router();

// CRUD
const UserResource = new RestfulUtil("User", userSchema);
UserResource.register(router, '/users');

const PostResource = new RestfulUtil("Post", postSchema);
PostResource.register(router, '/posts');


// 인증

// 회원가입
router.post(`${API_AUTH}/register`, AuthService.register);

// 로그인
router.post(`${API_AUTH}/signIn`, AuthService.signIn);

// 로그아웃
router.post(`${API_AUTH}/signOut`, AuthService.signOut);

export default router;