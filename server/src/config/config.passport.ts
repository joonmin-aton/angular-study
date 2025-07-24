import bcrypt from 'bcryptjs';
import passport from 'passport';
import passportJwt, { ExtractJwt } from 'passport-jwt';
import passportLocal from 'passport-local';
import userSchema from "../schema/schema.user.ts";

// username, password로 로그인하는 정통적인 방법
const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;

export const JWT_SECRET_KEY = "secretJMPark";

export default () => {
	passport.serializeUser((user: any, done) => {
		done(null, user);
	});

	passport.deserializeUser((user: any, done) => {
		done(null, user);
	});

	passport.use(new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email: any, password: any, done) => {
			try {
				// Mongodb User 검색
				const user = await userSchema.findOne({ email });
				if (!user) {
					return done(null, false, { message: '이메일을 확인해주세요' });
				}

				// 비밀번호 체크
				const validate = await bcrypt.compare(password, user.password);
				if (!validate) {
					return done(null, false, { message: '비밀번호를 확인해주세요' });
				}
				return done(null, user);
			}
			catch (e) {
				return done(e);
			}
		}
	));

	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: JWT_SECRET_KEY
			},
			async (payload, done) => {
				try {
					// Mongodb User 검색
					const user = await userSchema.findById({ id: payload?.id });
					if (!user) {
						return done(null, false);
					}
					return done(null, user);
				}
				catch (e) {
					return done(e);
				}
			}
		)
	)
}