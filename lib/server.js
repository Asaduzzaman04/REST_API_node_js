/*
 * Title : Server library
 * Description : Server related file
 * Auther : Asaduzzaman (Asad).
 * Date : 15/12/2024.
 */
//dependencies

const http = require("http");
const handleReqRes = require("../handlers/handleReqRes");
const environmentToExport = require("../handlers/enviorment");

// app object -- module scaffolding
const server = {};

//server create
server.createServer = () => {
  const createServerVariable = http.createServer(handleReqRes.resReq);
  createServerVariable.listen(environmentToExport.port, () => {
    console.log(
      `server runnng at  http://localhost:${environmentToExport.port}`
    );
  });
};

server.init = () => {
  server.createServer();
};

module.exports = server;
