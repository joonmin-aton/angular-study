"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportInit = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const LocalStrategy = passport_local_1.default.Strategy;
const passportInit = (app) => {
    app.use((0, cookie_parser_1.default)());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, express_session_1.default)({ secret: 'secretJMPark', resave: true, saveUninitialized: true }));
    // PASSPORT 설정
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Mongodb User 검색
            const user = null;
            if (!user) {
                return done(null, false, { message: '이메일을 확인해주세요' });
            }
            // 비밀번호 체크
            const validate = yield bcryptjs_1.default.compare(password, "");
            if (validate) {
                return done(null, false, { message: '비밀번호를 확인해주세요' });
            }
            return done(null, user);
        }
        catch (e) {
            return done(e);
        }
    })));
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = null;
            done(null, user);
        }
        catch (e) {
            done(e);
        }
    }));
};
exports.passportInit = passportInit;
