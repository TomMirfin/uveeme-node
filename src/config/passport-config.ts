// @ts-nocheck

import LocalStrategy from 'passport-local';
import { getUserByEmail } from '../controllers/usersController';
import bcrypt from 'bcrypt';


export function initializePassport(passport, getUserByEmail) {
    const authicateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user with that email' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }),
        authicateUser)
    passport.serializeUser((user, done) => { });
    passport.deserializeUser((id, done) => { });
}