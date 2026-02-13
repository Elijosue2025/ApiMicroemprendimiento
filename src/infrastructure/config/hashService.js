const bcrypt = require('bcryptjs');

module.exports = {
  hash: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  compare: async (password, hash) => {
    return bcrypt.compare(password, hash);
  }
};
