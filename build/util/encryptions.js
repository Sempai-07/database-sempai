import * as crypto from "crypto";
export function encryptions(message, key) {
    let userKey = crypto.createCipher('aes-128-cbc', key);
    let text = userKey.update(message, 'utf8', 'hex');
    text += userKey.final('hex');
    return text;
}
//# sourceMappingURL=encryptions.js.map