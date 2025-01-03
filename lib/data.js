//dependency

const fs = require("fs");
const path = require("path");

//module -- scaffolding

const lib = {};

//base directory for data folder
lib.baseDir = path.join(__dirname, "../.data/");

//* write data to file
lib.create = (dir, file, data, callback) => {
  //open file for writting
  fs.open(lib.baseDir + dir + "/" + file + ".json", "wx", (err, fd) => {
    if (!err && fd) {
      //convert data to string
      const stringData = JSON.stringify(data);
      // write data to file and close it
      fs.writeFile(fd, stringData, (err) => {
        if (!err) {
          fs.close(fd, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback("Error close the  new file");
            }
          });
        } else {
          callback("error writing a new file");
        }
      });
    } else {
      callback("could not create a new file, it may exist");
    }
  });
};

//* read data to file
lib.read = (dir, file, callback) => {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    {
      highWaterMark: 10,
      encoding: "utf-8",
    },
    (err, data) => {
      callback(err, data);
    }
  );
};

//updata data to file

lib.update = (dir, file, data, callback) => {
  // If the file is opened multiple times, ensure proper handling
  const stringifyData = JSON.stringify(data);
  //open the file
  fs.open(lib.baseDir + dir + "/" + file + ".json", "r+", (err, fd) => {
    if (!err && fd) {
      fs.ftruncate(fd, (err) => {
        if (!err) {
          fs.writeFile(fd, stringifyData, (err) => {
            if (!err) {
              fs.close(fd, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("error to closing file");
                }
              });
            } else {
              callback("error writing to file");
            }
          });
        } else {
          callback("error truncate file");
        }
      });
    } else {
      console.log("Unable to open file to" + file + ".json");
    }
  });
};

//delete existing file

lib.delete = (dir, file, callback) => {
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Unable to delete existing file : " + err);
    }
  });
};

//list all the items of directory
lib.list = (dir, callback) => {
  fs.readdir(lib.baseDir + dir, (err, fileName) => {
    if (!err && fileName && fileName.length > 0) {
      let trimedFile = [];
      file.forEach((file) => {
        trimedFile.push(file.replace(".json", ""));
      });
      callback(false, trimedFile);
    } else {
      callback("there was a problem to read directory");
    }
  });
};
//? export the lib module
module.exports = lib;
