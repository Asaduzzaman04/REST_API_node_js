//module - scaffolding
const routesHomeHandlers = {};

routesHomeHandlers.home = (requestProperty, callback) => {
  const acceptedMethod = ["get", "post", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperty.method) > -1) {
    console.log(requestProperty);
    callback(200, {
      massage: "this is home  page",
    });
  } else {
    callback(405, {
      massage: "your requested method is not allows",
    });
  }
};

module.exports = routesHomeHandlers;
