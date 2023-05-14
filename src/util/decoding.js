const crypto = require('crypto');
const decoding = (message, key) => {
  let userKey = crypto.createDecipher('aes-128-cbc', key);
  let text = userKey.update(message, 'hex', 'utf8');
  text += userKey.final('utf8');
  return text;
};
    
module.exports = decoding;