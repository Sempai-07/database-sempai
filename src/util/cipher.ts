import crypto from "crypto";
const cipher = (message: string, key: string) => {
  let userKey = crypto.createCipher("aes-128-cbc", key);
  let text = userKey.update(message, "utf8", "hex");
  text += userKey.final("hex");
  return text;
};

export { cipher };
