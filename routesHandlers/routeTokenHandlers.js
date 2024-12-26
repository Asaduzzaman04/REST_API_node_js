//dependencys

const data = require("../lib/data");
const utilities = require("../utils/utlities");

//module --scaffolding
const routeTokenHandlers = {};

//make a token handler
routeTokenHandlers.token = (requestproperty, callback) => {
  const acceptedMethod = ["get", "post", "delete", "put"];
  if (acceptedMethod.indexOf(acceptedMethod.method) >= -1) {
    routeTokenHandlers._token[requestproperty.method](
      requestproperty,
      callback
    );
  } else {
    callback(405, {
      massage: "you have a problem with login",
    });
  }
};
//create a privet a object for method
routeTokenHandlers._token = {};

//all token method function
//* post method for token
routeTokenHandlers._token.post = (requestproperty, callback) => {
  const phone =
    typeof requestproperty.body.phone === "string" &&
    requestproperty.body.phone.trim().length === 11
      ? requestproperty.body.phone
      : null;

  const password =
    typeof requestproperty.body.password === "string" &&
    requestproperty.body.password.trim().length >= 8
      ? requestproperty.body.password
      : null;
  if (phone && password) {
    data.read("users", phone, (err, uData) => {
      const userData = { ...utilities.parseJson(uData) };
      const haspass = utilities.hash(password);
      if (!err && haspass === userData.password) {
        let tokenId = utilities.token(20);
        let expire = Date.now() + 60 * 60 * 1000;
        let tokenObj = {
          phone,
          expire,
          id: tokenId,
        };

        data.create("tokens", tokenId, tokenObj, (err) => {
          if (!err) {
            callback(200, tokenObj);
          } else {
            callback(500, {
              massage: "there was a problem in server side",
            });
          }
        });
      } else {
        callback(404, {
          massage: "you have a problem in your password",
        });
      }
    });
  } else {
    callback(400, {
      massage: "you have a problem in your reqest",
    });
  }
};

//*get method for token
routeTokenHandlers._token.get = (requestproperty, callback) => {
  const id =
    typeof requestproperty.querys.id === "string" &&
    requestproperty.querys.id.trim().length === 20
      ? requestproperty.querys.id
      : null;

  if (id) {
    data.read("tokens", id, (err, uData) => {
      const userTokenData = {...utilities.parseJson(uData)};
      if (!err && userTokenData) {
        callback(200, userTokenData);
      } else {
        callback(500, {
          massage: "your requested token was not found",
        });
      }
    });
  } else {
    callback(400, {
      massage: "your requested token was not found",
    });
  }
};

//*update token expires
routeTokenHandlers._token.put = (requestproperty, callback) => {
  const id =
    typeof requestproperty.body.id === "string" &&
    requestproperty.body.id.trim().length === 20
      ? requestproperty.body.id
      : null;
  const extend =
    typeof requestproperty.body.extends === "boolean" &&
    requestproperty.body.extends === true
      ? true
      : false;

  if (id && extend) {
    data.read("tokens", id, (err, uData) => {
      const userData = utilities.parseJson(uData);
      if (!err && userData.expire > Date.now()) {
        userData.expire = Date.now() + 60 * 60 * 1000;
        data.update("tokens", id, userData, (err) => {
          if (!err) {
            callback(200, {
              massage: "token life time updated sucessfully",
            });
          } else {
            callback(500, {
              massage: "there was a server side error",
            });
          }
        });
      } else {
        callback(404, {
          massage: "token is expires",
        });
      }
    });
  } else {
    callback(400, {
      massage: "there was a problem in your request",
    });
  }
};

//*update token
routeTokenHandlers._token.delete = (requestproperty, callback) => {
  const id =
    typeof requestproperty.querys.id === "string" &&
    requestproperty.querys.id.trim().length === 20
      ? requestproperty.querys.id
      : null;
  if (id) {
    data.delete("tokens", id, (err) => {
      if (!err) {
        callback(200, {
          massage: "token deleted successfully",
        });
      } else {
        callback(500, {
          massage: "There was a problem in server side",
        });
      }
    });
  } else {
    callback(400, {
      massage: "unable to delete token",
    });
  }
};

//?token verify function
routeTokenHandlers._token.verify = (id, phone, callback) => {
  if (id && phone) {
    data.read("tokens", id, (err, tData) => {
      const tokenData = utilities.parseJson(tData);
      if (!err && tokenData) {
        if (tokenData.phone === phone && tokenData.expire > Date.now()) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  } else {
    callback(false);
  }
};

module.exports = routeTokenHandlers;
