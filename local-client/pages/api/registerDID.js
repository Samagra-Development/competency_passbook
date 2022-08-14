const fs = require("fs");
const crypto = require("crypto");
import axios from "axios";

export default async function handler(req, res) {
  // making sure that only POST requests are allowed
  if (req.method !== "POST") {
    res.status(405).send({
      message: "failed",
      description: "Only POST requests are allowed",
    });
    return;
  }

  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const contactField = req.body.contactField;

    const requestPublicKey = await axios.get(
      "http://localhost:3000/api/getPublicKey"
    );
    const publicKey = requestPublicKey.data["publicKey"];

    const didID = crypto
      .createHash("sha256")
      .update(contactField)
      .digest("hex");

    const JSONsignature = await axios.post(
      "http://localhost:3000/api/createSignature",
      {
        verifiableData: "did:ack:" + didID,
      }
    );
    const signature = JSONsignature.data["signature"];
    console.log("Signature : ", signature);

    const registrationResponse = await axios.post(
      "http://localhost:8001/resolve/registerDID",
      {
        firstName: firstName,
        lastName: lastName,
        contactField: contactField,
        publicKey: publicKey,
        didSignature: signature,
      }
    );
    res.status(registrationResponse.status).json(registrationResponse.data);
  } catch (error) {
    console.log(error);
    res.status(405).json({
      message: "failed",
      description: "Failed to Register DID",
      error: error,
    });
  }
}
