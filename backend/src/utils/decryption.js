import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const decryptfile = (encryptedfile) => {
  const key = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest();
  const iv = encryptedfile.slice(0, 12);
  const authTag = encryptedfile.slice(encryptedfile.length - 16); // Last 16 bytes as auth tag
  const encryptedData = encryptedfile.slice(12, encryptedfile.length - 16); //encrypted data

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const decryptedfile = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  return decryptedfile;
};

export default decryptfile;
