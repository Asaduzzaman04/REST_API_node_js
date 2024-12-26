//dependency
const crypto = require("crypto");
const environmentToExport = require("../handlers/enviorment");

//module scaffolding
const utilities = {};

//parse json string to object

utilities.parseJson = (stringData) => {
  let output;
  try {
    output = JSON.parse(stringData);
  } catch {
    output = {};
  }
  return output;
};

utilities.hash = (str) => {
  let output;
  if (typeof str === "string" && str.length > 8) {
    output = crypto
      .createHmac("sha256", environmentToExport.secrateKey)
      .update(str)
      .digest("hex");
  } else {
    return false;
  }
  return output;
};
//genrate a random token

utilities.token = (tokenString) => {
  let tokens = "";
  if (typeof tokenString === "number" && tokenString > 0) {
    for (let i = 0; i < tokenString; i++) {
      const totalKey = "abcdefghijklmnopqrstubwxyz123456789@#$%&";
      const randomNumber = Math.floor(Math.random() * totalKey.length);
      tokens += totalKey.charAt(randomNumber);
    }
  } else {
    return false;
  }
  return tokens;
};

module.exports = utilities;
