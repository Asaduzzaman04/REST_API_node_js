//dependencys
const data = require("../lib/data");
const utilities = require("../utils/utlities");
const routeTokenHandlers = require("../routesHandlers/routeTokenHandlers");
const environmentToExport = require("../handlers/enviorment");

//module -- scaffonding
const routeCheckHandlers = {};

//config
routeCheckHandlers.acceptedMethod = ["get", "post", "put", "delete"];

routeCheckHandlers.checkHandler = (requestProperty, callback) => {
  if (routeCheckHandlers.acceptedMethod.indexOf(requestProperty.method) > -1) {
    routeCheckHandlers._check[requestProperty.method](
      requestProperty,
      callback
    );
  } else {
    callback(405, {
      massage: "your requested method is not exist",
    });
  }
};

// check object for store method function
routeCheckHandlers._check = {};

routeCheckHandlers._check.post = (requestProperty, callback) => {
  //input validation
  const protocol =
    typeof requestProperty.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperty.body.protocol) > -1
      ? requestProperty.body.protocol
      : null;
  const url =
    typeof requestProperty.body.url === "string" &&
    requestProperty.body.url.trim().length > 0
      ? requestProperty.body.url
      : null;
  const method =
    typeof requestProperty.body.method === "string" &&
    routeCheckHandlers.acceptedMethod.indexOf(requestProperty.method) > -1
      ? requestProperty.body.method
      : null;

  const successCodes =
    typeof requestProperty.body.successCodes === "object" &&
    requestProperty.body.successCodes instanceof Array
      ? requestProperty.body.successCodes
      : null;

  const timeOutSecond =
    typeof requestProperty.body.timeOutSecond === "number" &&
    requestProperty.body.timeOutSecond % 1 === 0 &&
    requestProperty.body.timeOutSecond >= 1 &&
    requestProperty.body.timeOutSecond <= 5
      ? requestProperty.body.timeOutSecond
      : null;

  if (protocol && url && method && successCodes && timeOutSecond) {
    const token =
      typeof requestProperty.headers.token === "string" &&
      requestProperty.headers.token.trim().length === 20
        ? requestProperty.headers.token
        : null;
    if (token) {
      data.read("tokens", token, (err, tData) => {
        const tokenData = utilities.parseJson(tData);
        //lookup the user phone by reading the token
        if (!err && tokenData) {
          data.read("users", tokenData.phone, (err, uData) => {
            const userData = utilities.parseJson(uData);
            if (!err && userData) {
              routeTokenHandlers._token.verify(
                token,
                userData.phone,
                (isvalid) => {
                  if (isvalid) {
                    const userCheck =
                      typeof userData.check === "object" &&
                      userData.check instanceof Array
                        ? userData.check
                        : [];
                    if (userCheck.length < environmentToExport.maxChecks) {
                      const checkId = utilities.token(20);
                      const checkObj = {
                        id: checkId,
                        phone: userData.phone,
                        protocol,
                        url,
                        timeOutSecond,
                        method,
                        successCodes,
                      };
                      data.create("checks", checkId, checkObj, (err) => {
                        if (!err) {
                          userData.check = userCheck;
                          userData.check.push(checkId);
                          //save the new user data
                          data.update(
                            "users",
                            userData.phone,
                            userData,
                            (err) => {
                              if (!err) {
                                callback(200, checkObj);
                              } else {
                                callback(500, {
                                  massage: "there was a error in server side",
                                });
                              }
                            }
                          );
                        } else {
                          callback(500, {
                            massage: "there was a problme in server side",
                          });
                        }
                      });
                    } else {
                      callback(401, {
                        massage: "user has already reached the max limit",
                      });
                    }
                  } else {
                    callback(403, {
                      massage: "user data not valid",
                    });
                  }
                }
              );
            } else {
              callback();
            }
          });
        } else {
          callback(403, {
            massage: "your data is not  exiest ",
          });
        }
      });
    } else {
      callback(400, {
        massage: "authentication fail",
      });
    }
  } else {
    callback(400, {
      massage: "you have a problem in your request",
    });
  }
};
routeCheckHandlers._check.get = (requestProperty, callback) => {};
routeCheckHandlers._check.put = (requestProperty, callback) => {};
routeCheckHandlers._check.delete = (requestProperty, callback) => {};

//? export eheckhandler
module.exports = routeCheckHandlers;
