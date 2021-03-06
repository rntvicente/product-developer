const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");

const pkg = require("../../package.json");
const config = require("../config");
const errorHandlers = require("../error-handlers");
const router = require("../router");
const bearer = require("../auth/strategy-bearer");

const server = (() => {
  const app = express();
  const env = process.env.NODE_ENV;
  let serverProcess;

  const start = () =>
    new Promise((resolve) => {
      app.set("port", config.get("PORT") || 8339);
      app.use(cors());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(helmet());
      app.use(compression());
      app.use(router());
      app.use(errorHandlers);
      passport.use(bearer);

      serverProcess = app.listen(app.get("port"), () => {
        console.info("------------------------------------------------------------------");
        console.info(`${pkg.name} - Version: ${pkg.version}`);
        console.info("------------------------------------------------------------------");
        console.info(`ATTENTION, ${env} ENVIRONMENT!`);
        console.info("------------------------------------------------------------------");
        console.info(`Express server listening on port: ${serverProcess.address().port}`);
        console.info("------------------------------------------------------------------");

        return resolve(app);
      });
    });

  const stop = () =>
    new Promise((resolve, reject) => {
      if (serverProcess) {
        serverProcess.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      }
    });

  return {
    start,
    stop,
  };
})();

module.exports = server;
