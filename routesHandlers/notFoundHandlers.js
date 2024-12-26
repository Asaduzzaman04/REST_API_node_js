// module scaffolding
const routesHandlers = {};

routesHandlers.notFoundHandlers = (requestProperty, callback) =>{
    callback(404, {
        massage : "your requested url is not valid"
    })
}
module.exports = routesHandlers;