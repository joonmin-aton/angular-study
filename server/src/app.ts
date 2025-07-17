import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import PassportConfig from './config/config.passport.ts';
import AuthService from './service/service.auth.ts';
import BlogService from './service/service.blog.ts';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secretJMPark', resave: true, saveUninitialized: true }));

// PASSPORT 설정
app.use(passport.initialize());
app.use(passport.session());

PassportConfig();


// Mongoose 설정
mongoose
    .connect("mongodb://localhost:27017/study")
    .then(() => {
        console.log("Connected");
    })


app.get('/', (req, res) => {
    res.send('Hello world');
})

app.listen(port, () => {
    console.log(`Running server on port ${port}`)
});

/**
 * 1. 사용자 인증
 */
const API_AUTH = "/api/auth";

// 회원가입
app.post(`${API_AUTH}/register`, AuthService.register);

// 로그인
app.post(`${API_AUTH}/signin`, AuthService.signIn);

// 로그아웃
app.post(`${API_AUTH}/signout`, AuthService.signOut);


/**
 * 2. 블로그 CRUD
 */
const API_BLOG = "/api/blog";

// 블로그 CREATE
app.post(`${API_BLOG}/write`, BlogService.writePost);

// 블로그 UPDATE
app.post(`${API_BLOG}/update`, BlogService.updatePost);

// 블로그 DELETE
app.post(`${API_BLOG}/delete`, BlogService.deletePost);

// 블로그 PAGES
app.post(`${API_BLOG}/list`, BlogService.list);

// 블로그 READ
app.post(`${API_BLOG}/detail`, BlogService.detail);


/**
 * 3. 컨텐츠 키워드 Top 5
 */
app.post(`${API_BLOG}/keywords`, (req, res) => {

});