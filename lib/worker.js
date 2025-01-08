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
const notification = require("../handlers/notification");

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
  let outcomeSent = {
    error: false,
    responseCode: false,
  };
  //parse the host name form original data
  let parseUrl = url.parse(checkdata.protocol + "://" + checkdata.url, true);
  const hostName = parseUrl.hostname;
  const path = parseUrl.path;
  //construct the request
  const requestDetails = {
    protocol: checkdata.protocol + ":",
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
    outcomeSent.responseCode = status;
    // update the check outcome and pass to the next process
    if (!outcomeSent) {
      workers.processOutcomeCheck(requestDetails, outcomeSent);
      outcomeSent = true;
    }
  });
  req.on("error", (e) => {
    outcomeSent = {
      error: true,
      value: e,
    };
    if (!outcomeSent) {
      workers.processOutcomeCheck(requestDetails, outcomeSent);
      outcomeSent = true;
    }
  });

  req.on("timeout", () => {
    outcomeSent = {
      error: true,
      value: "timeout ",
    };
    if (!outcomeSent) {
      workers.processOutcomeCheck(requestDetails, outcomeSent);
      outcomeSent = true;
    }
  });
  //end the response
  req.end();
};

worker.processCheckOutcome = (originalCheckData, checkOutCome) => {
  // check if check outcome is up or down
  const state =
    !checkOutCome.error &&
    checkOutCome.responseCode &&
    originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
      ? "up"
      : "down";

  // decide whether we should alert the user or not
  const alertWanted =
    originalCheckData.lastChecked && originalCheckData.state !== state
      ? true
      : false;

  // update the check data
  const newCheckData = originalCheckData;

  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  // update the check to disk
  data.update("checks", newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        // send the checkdata to next process
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log("Alert is not needed as there is no state change!");
      }
    } else {
      console.log("Error trying to save check data of one of the checks!");
    }
  });
};

// send notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData) => {
  const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

  notification.sendTwilioSms(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`User was alerted to a status change via SMS: ${msg}`);
    } else {
      console.log("There was a problem sending sms to one of the user!");
    }
  });
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
