const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const model = require("../model/users.model");

passport.use(new LocalStrategy(
  async function(username, password, done) {

    const user = await model.checkCredential(username, password);
console.log(user);
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password' });
    }

    if (user.role != 'quản trị') {
      return done(null, false, { message: 'You are not a admin' });
    }

    return done(null, user);

  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  model.getUser(id).then((user) => {
    done(null, user[0]);
  });
});

module.exports = passport;