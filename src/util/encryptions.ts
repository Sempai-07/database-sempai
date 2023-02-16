import * as crypto from "crypto"
export function encryptions(message: any, key: any) {
  let userKey = crypto.createCipher('aes-128-cbc', key);
  let text = userKey.update(message, 'utf8', 'hex');
  text += userKey.final('hex');
  return text;
}