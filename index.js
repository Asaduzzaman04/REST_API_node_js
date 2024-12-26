/*
 * Title : Build first uptime monitoring application  with raw node.
 * Description : A Restful api to monitoring user defined links.
 * Auther : Asaduzzaman (Asad).
 * Date : 15/12/2024.
 */
//dependencies
const http = require("http");
const handleReqRes = require("./handlers/handleReqRes");
const environmentToExport = require("./handlers/enviorment");


// app object -- module scaffolding
const app = {};


//server create
app.createServer = () => {
  const server = http.createServer(handleReqRes.resReq);
  server.listen(environmentToExport.port, () => {
    console.log(
      `server runnng at  http://localhost:${environmentToExport.port}`
    );
  });
};

app.createServer();
