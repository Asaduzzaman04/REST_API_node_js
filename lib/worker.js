/*
 * Title :workers library.
 * Description : workers related file
 * Auther : Asaduzzaman (Asad).
 * Date : 15/12/2024.
 */
//dependencies
const url = require("url");
const http = require("http");
const https = require("https");
const data = require("./data");
const utilities = require("../utils/utlities");

// workers object -- module scaffolding
const workers = {};

workers.geatherAllChecks = () => {
  //listing all the file
  data.list("checks", (err, fileData) => {
    if (!err && fileData.legth > 0) {
      fileData.forEach((check) => {
        //read the all check data
        data.read("checks", check, (err, checkdata) => {
          if (!err && checkdata) {
            //pass the data to the next process
            workers.validateCheckData(utilities.parseJson(checkdata));
          } else {
            console.log("Error : Reading one of the check data");
          }
        });
      });
    } else {
      console.log("Error : Could not find any file to process");
    }
  });
};

//validate check data
workers.validateCheckData = (checkdata) => {
  if (checkdata && checkdata.id) {
    checkdata.stats =
      typeof checkdata.stats === "stats" &&
      ["up", "down"].indexOf(checkdata.stats) > -1
        ? checkdata.stats
        : "down";
    checkdata.lastCheck =
      typeof checkdata.lastCheck === "number" && checkdata.lastCheck > 0
        ? checkdata.lastCheck
        : null;
    //pass the next process
    workers.perfomeCheck(checkdata);
  } else {
    console.log("Error : check was invalid or ID is not valid");
  }
};
//workers perfome function
workers.perfomeCheck = (checkdata) => {
  //parse the host name form original data
  let parseUrl = url.parse(checkdata.protocol + "://" + checkdata.url, true);
  const hostName = parseUrl.hostname;
  const path = parseUrl.path;
  //construct the request
  const requestDetails = {
    protocol: checkdata.protocol,
    hostName,
    method: checkdata.method.toUpperCase(),
    path,
    timeout: checkdata.timeOutSecond * 1000,
  };
  //check the protocol of the user gives and response protocol depending user
  const protocolToUse = checkdata.protocol === "http" ? http : https;
  let req = protocolToUse.request(requestDetails, (res) => {
    //grab the status of the response
    const status = res.statusCode;
    // update the check outcome and pass to the next process
  });
  req.on("error", (e) => {
    console.log(e);
  });

  //end the response
  req.end();
};
workers.loop = () => {
  //geather all checks function  loop through per munite
  setInterval(() => {
    workers.geatherAllChecks();
  }, 1000 * 60);
};

//start the workers
workers.init = () => {
   //execute all the check
   workers.geatherAllChecks();
   //call the loop so that checks continue
   workers.loop();
};
module.exports = workers;
