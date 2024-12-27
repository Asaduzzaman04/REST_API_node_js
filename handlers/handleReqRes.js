//dependancy
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes/routes");
const { notFoundHandlers } = require("../routesHandlers/notFoundHandlers");
const utilities = require("../utils/utlities");
// module scaffolding
const handleReqRes = {};

handleReqRes.resReq = (req, res) => {
  //parse the url
  const parseUrl = url.parse(req.url, true);
  const pathName = parseUrl.pathname;
  const method = req.method.toLowerCase();
  const trimedString = pathName.replace(/^\/+|\/+$/g, "");
  const querys = parseUrl.query;
  const headers = req.headers;
  const decoder = new StringDecoder("utf-8");
  //create a response object for sent it in a callback function as a argument
  const requestProperty = {
    parseUrl, 
    pathName,
    method,
    trimedString,
    querys,
    headers,  
  };
  const chosenHandler = routes[trimedString]
    ? routes[trimedString]
    : notFoundHandlers;

  let data = "";
  req.on("data", (buffer) => {
    data += decoder.write(buffer);
  });
  req.on("end", () => {
    data += decoder.end();
    requestProperty.body = utilities.parseJson(data);

    chosenHandler(requestProperty, (status, payload) => {
      status = typeof status === "number" ? status : 500;
      payload = typeof payload === "object" ? payload : {};
      const payloadString = JSON.stringify(payload);
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(payloadString);
    });

    console.log("hello world");
  });
};

module.exports = handleReqRes;
