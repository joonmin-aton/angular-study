import express from "express";
import userSchema from "../schema/schema.user.ts";
import postSchema from "../schema/schema.post.ts";
import RestfulUtil from "../utils/util.restful.ts";

const router = express.Router();

const UserResource = new RestfulUtil(userSchema);
UserResource.register(router, '/user');

const PostResource = new RestfulUtil(postSchema);
PostResource.register(router, '/posts');

export default router;