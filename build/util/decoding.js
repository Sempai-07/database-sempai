import crypto from "crypto";
export function decoding(message, key) {
    let userKey = crypto.createDecipher('aes-128-cbc', key);
    let text = userKey.update(message, 'hex', 'utf8');
    text += userKey.final('utf8');
    return text;
}
//# sourceMappingURL=decoding.js.map