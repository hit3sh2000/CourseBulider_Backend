const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await User.findOne({U_username:username});
      if (user) {
        user = user.toJSON();
        const checkpassword = await bcrypt.compare(password, user.U_password);
        if (checkpassword) {
          done(null, user);
        } else {
          done(null, false);
        }
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  })
);

module.exports = passport;
