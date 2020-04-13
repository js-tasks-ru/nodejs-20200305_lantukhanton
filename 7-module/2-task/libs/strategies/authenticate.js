const User = require('../../models/User');


module.exports = function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  return User.findOne({email}, async function(err, user) {
    if (err) return done(err);

    if (!user) {
      await User.create({email, displayName}, async function(err, user) {
        if (err) return done(err);

        return done(null, user);
      });
    }

    return done(null, user);
  });
};
