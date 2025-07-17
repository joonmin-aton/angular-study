import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import PassportConfig from './config/config.passport.ts';
import router from './routes/routes.api.ts';

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(bodyParser.json());
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
});

app.listen(port, () => {
    console.log(`Running server on port ${port}`)
});


app.use("/api", router)

/**
 * 1. 사용자 인증
 */

/**
 * 2. 블로그 CRUD
 */

/**
 * 3. 컨텐츠 키워드 Top 5
 */
// app.post(`${API_BLOG}/keywords`, (req, res) => {

// });