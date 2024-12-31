//? (sms) notification function for users
//? 30/12/2024

//*dependency
require("dotenv").config();
const https = require("https");
const querystring = require("querystring");

//*module scaffolding
const notifications = {};

//?send SMS to user using Twilio API
notifications.sendTwilioSms = (phone, msg, callback) => {
  //input validation
  const validPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;
  const validMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (validPhone && validMsg) {
    //configure the requested payload
    const payload = {
      From: process.env.TWILIO_PHONE_NUMBER,
      To: `+88${validPhone}`,
      Body: validMsg,
    };

    //stringify the payload
    const stringifiedPayload = querystring.stringify(payload);

    //configure the request details
    const reqDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNTSID}/Messages.json`,
      auth: `${process.env.TWILIO_ACCOUNTSID}:${process.env.TWILIO_AUTHTOKEN}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringifiedPayload),
      },
    };

    //create the request object
    const req = https.request(reqDetails, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        const status = res.statusCode;
        //callback successfully if the request went through
        if (status === 200 || status === 201) {
          callback(false, JSON.parse(responseData));
        } else {
          callback(`Error: Received status code ${status}`);
        }
      });
    });

    //handle errors
    req.on("error", (e) => {
      callback(`Request error: ${e.message}`);
    });

    //send the request with the payload
    req.write(stringifiedPayload);
    req.end();
  } else {
    callback("Invalid or missing parameters");
  }
};

module.exports = notifications;
