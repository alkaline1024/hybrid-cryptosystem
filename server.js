import express from "express";
import crypto from "crypto";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// generate RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

app.get("/public-key", (req, res) => {
  const publicKeyBase64 = publicKey
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\n/g, "");

  res.send(publicKeyBase64);
});

app.post("/decrypt", (req, res) => {
  const { encryptedData, aesKey } = req.body;

  try {
    console.log("Received AES Key (Base64):", aesKey);
    if (typeof aesKey !== "string" && !Buffer.isBuffer(aesKey)) {
      throw new TypeError(
        "Invalid AES Key format. Expected a Base64 string or Buffer."
      );
    }

    console.log("Received Encrypted Data (Base64):", encryptedData);
    // decrypt encrypted AES key using RSA private key
    const decryptedAesKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(aesKey, "base64")
    );

    console.log("Decrypted AES Key:", decryptedAesKey.toString("hex"));

    // decrypt encrypted data using AES key
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      decryptedAesKey,
      Buffer.alloc(16, 0)
    );
    let decrypted = decipher.update(Buffer.from(encryptedData, "base64"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    res.send({ decryptedData: decrypted.toString() });
  } catch (error) {
    console.error("Decryption error:", error);
    res
      .status(500)
      .send({ error: "Decryption failed", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
