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

  console.log(req.body);

  const claimName = req.body.claimName;
  const claimDescription = req.body.claimDescription;
  const claimType = req.body.claimType;
  const sender = req.body.sender;
  const receiver = req.body.receiver;
  const data = req.body.claim;

  if (
    claimName === undefined ||
    claimDescription === undefined ||
    claimType === undefined ||
    sender === undefined ||
    receiver === undefined ||
    data === undefined
  ) {
    res.status(405).json({
      message: "failed",
      description: "Some data is missing.",
    });
  } else {
    try {
      const JSONencryptedData = await axios.post(
        "http://localhost:3000/api/encryptData",
        {
          dataToEncrypt: JSON.stringify(data),
        }
      );
      console.log("JSONencryptedData :", JSONencryptedData);
      const encryptedData = JSONencryptedData.data["encryptedData"];

      console.log("total data : ", JSON.stringify(data));
      const JSONsignature = await axios.post(
        "http://localhost:3000/api/createSignature",
        {
          verifiableData: encryptedData,
        }
      );
      const signature = JSONsignature.data["signature"];
      console.log("Signature : ", signature);

      res.status(200).json({
        message: "success",
        claimName: claimName,
        claimDescription: claimDescription,
        claimType: claimType,
        sender: sender,
        receiver: receiver,
        claim: encryptedData,
        signature: signature,
      });
    } catch (error) {
      console.log("error :", error);
      res.status(405).json({
        message: "failed",
        description: "Failed to create claim",
        error: error,
      });
    }
  }
}
