// /config/passport.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { getUserByEmailQuery, getUserByIdQuery } from '../models/usersModels';

export const passportConfig = () => {
    // Define local strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const rows: any = await getUserByEmailQuery(email);
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials.' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Optional: If you're using sessions, this is how you serialize and deserialize
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const rows: any = await getUserByIdQuery(id);
            const user = rows[0];
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
