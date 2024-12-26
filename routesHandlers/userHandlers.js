//dependencys
const data = require("../lib/data");
const utilities = require("../utils/utlities");

//module scaffolding
const   routesUserHandlers = {};

routesUserHandlers.user = (requestProperty, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperty.method) > -1) {
    routesUserHandlers._usersMethod[requestProperty.method](
      requestProperty,
      callback
    );
  } else {
    callback(405, {
      massage: "your requested method is not allows",
    });
  }
};

//privet methods response function
routesUserHandlers._usersMethod = {};

//all method function
//* post method function
routesUserHandlers._usersMethod.post = (requestProperty, callback) => {
  const firstName =
    typeof requestProperty.body.firstName === "string" &&
    requestProperty.body.firstName.trim().length > 0
      ? requestProperty.body.firstName
      : null;
  const lastName =
    typeof requestProperty.body.lastName === "string" &&
    requestProperty.body.lastName.trim().length > 0
      ? requestProperty.body.lastName
      : null;
  const phone =
    typeof requestProperty.body.phone === "string" &&
    requestProperty.body.phone.trim().length === 11
      ? requestProperty.body.phone
      : null;
  const password =
    typeof requestProperty.body.password === "string" &&
    requestProperty.body.password.trim().length >= 8
      ? requestProperty.body.password
      : null;
  const tosAgreement =
    typeof requestProperty.body.tosAgreement === "boolean" &&
    requestProperty.body.tosAgreement === true
      ? requestProperty.body.tosAgreement
      : false;

  const checkAllProperty =
    firstName && lastName && phone && password && tosAgreement;

  if (checkAllProperty) {
    // make sure is user does not exist
    data.read("users", phone, (err) => {
      if (err) {
        let userInfo = {
          firstName,
          lastName,
          phone,
          tosAgreement,
          password: utilities.hash(password),
        };
        data.create("users", phone, userInfo, (err) => {
          if (!err) {
            callback(200, {
              massage: "User was created successfully",
            });
          } else {
            callback(500, {
              error: "Could not create user ",
            });
          }
        });
      } else {
        callback(400, {
          error: "user already exist",
        });
      }
    });
  } else {
    callback(500, {
      error: "you have a problem in your request",
    });
  }
};
//* get method function
routesUserHandlers._usersMethod.get = (requestProperty, callback) => {
  const phone =
    typeof requestProperty.querys.phone === "string" &&
    requestProperty.querys.phone.trim().length === 11
      ? requestProperty.querys.phone
      : null;
  if (phone) {
    data.read("users", phone, (err, u) => {
      const copyData = { ...utilities.parseJson(u) };
      if (!err && copyData) {
        delete copyData.password;
        callback(200, copyData);
      }
    });
  }
};

//* update method function
routesUserHandlers._usersMethod.put = (requestProperty, callback) => {
  //check if phone number is valid
  const phone =
    typeof requestProperty.body.phone === "string" &&
    requestProperty.body.phone.trim().length === 11
      ? requestProperty.body.phone
      : null;
  const firstName =
    typeof requestProperty.body.firstName === "string" &&
    requestProperty.body.firstName.trim().length > 0
      ? requestProperty.body.firstName
      : null;
  const lastName =
    typeof requestProperty.body.lastName === "string" &&
    requestProperty.body.lastName.trim().length > 0
      ? requestProperty.body.lastName
      : null;
  const password =
    typeof requestProperty.body.password === "string" &&
    requestProperty.body.password.trim().length >= 8
      ? requestProperty.body.password
      : null;

  if (phone) {
    if (firstName || lastName || password) {
      //lookup the user
      data.read("users", phone, (err, uData) => {
        const userData = { ...utilities.parseJson(uData) };
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = utilities.hash(password);
          }
          //update user data to database
          data.update("users", phone, userData, (err) => {
            if (!err) {
              callback(200, {
                massage: "data updated successfully",
              });
            } else {
              callback(500, {
                massage:
                  "unable to update your information its a server side issue",
              });
            }
          });
        } else {
          callback(400, {
            massage: "you have a problem in your request",
          });
        }
      });
    } else {
      callback(400, {
        massage: "you have a problem in your requsets",
      });
    }
  } else {
    callback(400, {
      massage: "invalid phone number",
    });
  }
};
//* delete method function
routesUserHandlers._usersMethod.delete = (requestProperty, callback) => {
  const phone =
    typeof requestProperty.querys.phone === "string" &&
    requestProperty.querys.phone.trim().length === 11
      ? requestProperty.querys.phone
      : null;
  if (phone) {
    data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        data.delete("users", phone, (err) => {
          if (!err) {
            callback(200, {
              massage: "your file deleted succesfully",
            });
          } else {
            callback(400, {
              massage: "there was a problem to delete the data",
            });
          }
        });
      } else {
      }
    });
  } else {
    callback(400, {
      massage: "there was a problem to delete the data",
    });
  }
};

module.exports = routesUserHandlers;
