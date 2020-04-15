const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', passwordField: 'password', session: false},
    async function(email, password, done) {
      return User.findOne({email}, async function(err, user) {
        if (err) return done(err);

        if (!user) return done(null, false, 'Нет такого пользователя');
        const foundUser = new User(user);

        return foundUser.checkPassword(password)
            .then((isValidPassword) => {
              if (!isValidPassword) return done(null, false, 'Неверный пароль');

              return done(null, user);
            })
            .catch((err) => {
              if (err) return done(err);
            });
      });
    }
);
