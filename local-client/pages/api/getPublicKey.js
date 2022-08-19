const fs = require("fs");

export default function handler(req, res) {
  // making sure that only GET requests are allowed
  if (req.method !== "GET") {
    res.status(405).send({
      message: "failed",
      description: "Only GET requests are allowed",
    });
    return;
  }

  try {
    // access the publicKey from the file system
    const publicKey = fs.readFileSync("public.pem", { encoding: "utf-8" });
    res.status(200).json({
      message: "success",
      encoding: "utf-8",
      publicKey: publicKey,
    });
  } catch (error) {
    console.log("error :", error);
    res.status(200).json({
      message: "failed",
      description: "No Public Key Found",
      error: error,
    });
  }
}
