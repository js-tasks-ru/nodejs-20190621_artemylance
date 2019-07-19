const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');

  try {
    const user = await User.findOne({email});
    if (!user) {
      const newUser = await User.create({displayName, email});

      return done(null, newUser);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
};
