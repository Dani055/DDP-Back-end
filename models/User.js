const mongoose = require('mongoose');
const encryption = require('../util/encryption');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: Schema.Types.String,
    required: true
  },
  hashedPassword: {
    type: Schema.Types.String,
    required: true
  },
  firstName: {
    type: Schema.Types.String
  },
  lastName: {
    type: Schema.Types.String
  },
  salt: {
    type: Schema.Types.String,
    required: true
  },
  roles: [{type: Schema.Types.String, required: true}]
});

userSchema.method({
  authenticate: function (password) {
    const currentHashedPass = encryption.generateHashedPassword(this.salt, password);

    return currentHashedPass === this.hashedPassword;
  }
});

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
  try {
    let users = await User.find();
    if (users.length > 0) return;
    const salt = encryption.generateSalt();
    const hashedPassword = encryption.generateHashedPassword(salt, '123rty');
    return User.create({
      username: 'Dido',
      firstName: 'Doychin',
      lastName: 'D',
      salt,
      hashedPassword,
      roles: ['Admin', 'Mechanic']
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = User;