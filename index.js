/*
 * Title : initial file to start the node server and  workers
 * Description : A Restful api to monitoring user defined links.
 * Auther : Asaduzzaman (Asad).
 * Date : 15/12/2024.
 */
//dependencies
const server = require("./lib/server");
const workers = require("./lib/worker");

// app object -- module scaffolding
const app = {};

app.init = () => {
  //start the server
  server.init();

  //start the worker
  workers.init();
};

//call the init function for running the server
app.init();

module.exports = app;
