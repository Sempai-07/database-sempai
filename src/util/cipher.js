const crypto = require('crypto');
const cipher = (message, key) => {
  let userKey = crypto.createCipher('aes-128-cbc', key);
  let text = userKey.update(message, 'utf8', 'hex');
  text += userKey.final('hex');
  return text;
};

module.exports = cipher;