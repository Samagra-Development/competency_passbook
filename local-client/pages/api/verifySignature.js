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

  if (req.body.signature === undefined) {
    res.status(405).json({
      message: "failed",
      description: "No Signature To Verify",
    });
  } else {
    try {
      const signature = Buffer.from(req.body.signature, "base64");
      const data = req.body.data;

      const publicKey = fs.readFileSync("public.pem", { encoding: "utf-8" });

      // To verify the data, we provide the same hashing algorithm and
      // padding scheme we provided to generate the signature, along
      // with the signature itself, the data that we want to
      // verify against the signature, and the public key
      const isVerified = crypto.verify(
        "sha256",
        Buffer.from(data),
        {
          key: publicKey,
        },
        signature
      );

      // isVerified should be `true` if the signature is valid
      console.log("signature verified: ", isVerified);
      res.status(200).json({
        signature: req.body.signature,
        data: req.body.data,
        verified: isVerified,
      });
    } catch (error) {
      console.log("error :", error);
      res.status(405).json({
        message: "failed",
        description: "Unable to Verify Signature",
        error: error,
      });
    }
  }
}
