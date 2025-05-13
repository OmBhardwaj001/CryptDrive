import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const encryptfile = (buffer) => {
  const key = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encryptedBuffer = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  const result = Buffer.concat([iv, encryptedBuffer, authTag]);

  return result;
};

export default encryptfile;
