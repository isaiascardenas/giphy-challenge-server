const connection = require("./database");
const giphyService = require("./../services/giphy.service");

const fs = require("fs");
const path = require("path");

module.exports = {
  initDB: () => {
    fs.readFile(path.join(__dirname, "scripts/dropTables.sql"), (err, data) => {
      if (!err) {
        connection.query(data.toString(), (sqlError) => {
          if (sqlError) {
            throw sqlError;
          }
          console.log("-> Iniciando base de datos");
          fs.readFile(
            path.join(__dirname, "scripts/createTables.sql"),
            (err, data) => {
              if (!err) {
                connection.query(data.toString(), (sqlError) => {
                  if (sqlError) {
                    throw sqlError;
                  }
                  console.log("-> Base de datos lista");
                  giphyService();
                });
              } else {
                console.log("error reading database setup file: ", err);
              }
            },
          );
        });
      } else {
        console.log("error reading database setup file: ", err);
      }
    });
  },
};
