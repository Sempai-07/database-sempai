import crypto from "crypto";
const decoding = (message: string, key: string) => {
  let userKey = crypto.createDecipher("aes-128-cbc", key);
  let text = userKey.update(message, "hex", "utf8");
  text += userKey.final("utf8");
  return text;
};

export { decoding };
