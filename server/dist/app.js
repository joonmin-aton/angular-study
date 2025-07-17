"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_passport_1 = require("./config/config.passport");
const app = (0, express_1.default)();
const port = 3000;
(0, config_passport_1.passportInit)(app);
app.get('/', (req, res) => {
    res.send('Hello world');
});
app.listen(port, () => {
    console.log(`Running server on port ${port}`);
});
/**
 * 1. 사용자 인증
 */
const API_AUTH = "/api/auth";
// 회원가입
app.post(`${API_AUTH}/register`, (req, res) => {
});
// 로그인
app.post(`${API_AUTH}/register`, (req, res) => {
});
// 로그아웃
app.post(`${API_AUTH}/register`, (req, res) => {
});
/**
 * 2. 블로그 CRUD
 */
const API_BLOG = "/api/blog";
// 블로그 CREATE
app.post(`${API_BLOG}/write`, (req, res) => {
});
// 블로그 UPDATE
app.post(`${API_BLOG}/update`, (req, res) => {
});
// 블로그 DELETE
app.post(`${API_BLOG}/delete`, (req, res) => {
});
// 블로그 PAGES
app.post(`${API_BLOG}/list`, (req, res) => {
});
// 블로그 READ
app.post(`${API_BLOG}/detail`, (req, res) => {
});
/**
 * 3. 컨텐츠 키워드 Top 5
 */
app.post(`${API_BLOG}/keywords`, (req, res) => {
});
