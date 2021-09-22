const passport = require('passport');
const bearerStratigy = require('passport-http-bearer').Strategy;
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken')

passport.use(
    new bearerStratigy(async (token, done) => {
        try {
            const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(decodedToken.userId);
            if (!user) {
                return done(null, false);
            } else {
                return done(null, user, { scope: "all" });
            }
        } catch (err) {
            return done(null, false);
        }

    })
)