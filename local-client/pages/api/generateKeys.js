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

  try {
    // testing file access fallback
    const publicKeyExistence = fs.readFileSync("public.pem", {
      encoding: "utf-8",
    });
    console.log("publicExistence :", publicKeyExistence);

    res.status(200).json({
      message: "failed",
      description: "Pre Existing Public Key Found",
    });
  } catch (error) {
    console.log("error :", error);

    // creating the public and private keys
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });

    // converting the publicKey to PEM format
    const exportedPublicKeyBuffer = publicKey.export({
      type: "pkcs1",
      format: "pem",
    });

    // storing the publicKey in a file (PEM format)
    fs.writeFileSync("public.pem", exportedPublicKeyBuffer, {
      encoding: "utf-8",
    });

    // converting the privateKey to PEM format
    const exportedPrivateKeyBuffer = privateKey.export({
      type: "pkcs1",
      format: "pem",
    });

    // storing the privateKey in a file (PEM format)
    fs.writeFileSync(".ackshare/private.pem", exportedPrivateKeyBuffer, {
      encoding: "utf-8",
    });

    res.status(200).json({
      message: "success",
      description: "Keys generated successfully",
    });
  }
}
