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

  // access the data (utf-8 format) from the request body
  const dataToEncrypt = req.body.dataToEncrypt;
  console.log("dataToEncrypt :", dataToEncrypt);
  if (dataToEncrypt === undefined) {
    res.status(405).json({
      message: "failed",
      description: "No Data Found",
    });
  } else {
    try {
      // access the publicKey from the file system
      const publicKey = Buffer.from(
        fs.readFileSync("public.pem", {
          encoding: "utf-8"
        })
      );

      // encrypting the data
      const encryptedData = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(dataToEncrypt)
      );

      // converting encrypted data to base64 format
      const base64EncryptedData = encryptedData.toString("base64");

      res.status(200).json({
        message: "success",
        encryptedData: base64EncryptedData,
      });
    } catch (error) {
      console.log("error :", error);
      res.status(200).json({
        message: "failed",
        description: "Failed to encrypt the data",
        error: error,
      });
    }
  }
}
