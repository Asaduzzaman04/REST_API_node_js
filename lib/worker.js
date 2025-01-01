/*
 * Title :workers library.
 * Description : workers related file
 * Auther : Asaduzzaman (Asad).
 * Date : 15/12/2024.
 */
//dependencies

// workers object -- module scaffolding
const workers = {};

//start the workers
const workerServers = () => {
  console.log("workers server started");
};
//call the workers function
workers.init = () => {
  workerServers();
};
module.exports = workers;
