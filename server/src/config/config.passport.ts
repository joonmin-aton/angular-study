import bcrypt from 'bcryptjs';
import passport from 'passport';
import passportLocal from 'passport-local';

// username, password로 로그인하는 정통적인 방법
const LocalStrategy = passportLocal.Strategy;

export default () => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email: any, password: any, done) => {
            try {
                // Mongodb User 검색
                const user = null;
                if (!user) {
                    return done(null, false, { message: '이메일을 확인해주세요' });
                }

                // 비밀번호 체크
                const validate = await bcrypt.compare(password, "");
                if (validate) {
                    return done(null, false, { message: '비밀번호를 확인해주세요' });
                }
                
                return done(null, user);
            }
            catch (e) {
                return done(e);
            }
        }
    ));

    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: any, done) => {
        try {
            const user = null;
            done(null, user);
        }
        catch (e) {
            done(e);
        }
    });
}