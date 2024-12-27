//module - dependencies
const routesHomeHandlers = require("../routesHandlers/routesHandlers");
const routesUserHandlers = require("../routesHandlers/userHandlers");
const routeTokenHandlers = require("../routesHandlers/routeTokenHandlers");
const routeCheckHandlers = require("../routesHandlers/routeCheckHandlers");

const routes = {
  home: routesHomeHandlers.home,
  user: routesUserHandlers.user,
  token: routeTokenHandlers.token,
  check: routeCheckHandlers.checkHandler,
};
module.exports = routes;
