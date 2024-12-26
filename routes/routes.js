//module - dependencies
const routesHomeHandlers = require("../routesHandlers/routesHandlers");
const routesUserHandlers = require("../routesHandlers/userHandlers");
const routeTokenHandlers = require("../routesHandlers/routeTokenHandlers");

const routes = {
  home: routesHomeHandlers.home,
  user: routesUserHandlers.user,
  token: routeTokenHandlers.token,
};
module.exports = routes;
