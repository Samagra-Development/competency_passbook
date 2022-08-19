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

  const verifiableData = req.body.verifiableData;
  if (verifiableData === undefined) {
    res.status(405).json({
      message: "failed",
      description: "No Data Found to Sign",
    });
  } else {
    try {
      // access the privateKey from the file system
      const privateKey = fs.readFileSync(".ackshare/private.pem", {
        encoding: "utf-8",
      });

      // sign the data
      const signature = crypto.sign("sha256", Buffer.from(verifiableData), {
        key: privateKey,
      });

      const base64EncodedSignature = signature.toString("base64");

      res.status(200).json({
        message: "success",
        data: verifiableData,
        signature: base64EncodedSignature,
      });
    } catch (error) {
      console.log("error :", error);
      res.status(405).json({
        message: "failed",
        description: "Failed to sign the data",
        error: error,
      });
    }
  }
}
