const fs = require("fs");
const crypto = require("crypto");

export default function handler(req, res) {
  // making sure that only POST requests are allowed
  if (req.method !== "POST") {
    res.status(405).send({
      message: "failed",
      description: "Only POST requests are allowed",
    });
    return;
  }

  console.log(req.body);

  // access the encryptedData (base64 format) from the request body
  const encryptedData = req.body.encryptedData;
  console.log("encryptedData :", encryptedData);
  if (encryptedData === undefined) {
    res.status(405).json({
      message: "failed",
      description: "No Encrypted Data Found",
    });
  } else {
    try {
      // access the privateKey from the file system
      const privateKey = fs.readFileSync(".ackshare/private.pem", {
        encoding: "utf-8",
      });

      // decrypting the data
      const decryptedData = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(encryptedData, "base64")
      );

      // converting encrypted data to base64 format
      const utf8DecryptedData = decryptedData.toString("utf-8");

      res.status(200).json({
        message: "success",
        decryptedData: utf8DecryptedData,
      });
    } catch (error) {
      console.log("error :", error);
      res.status(405).json({
        message: "failed",
        description: "Failed to decrypt the data",
        error: error,
      });
    }
  }
}
