'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#bootstrap
 */

module.exports = () => {
  // import socket io
  var io = require('socket.io')(strapi.server, {
    cors: {
      origins: ["*"],
      handlePreflightRequest: (req, res) => {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "https://example.com",
          "Access-Control-Allow-Methods": "GET,POST",
          "Access-Control-Allow-Headers": "my-custom-header",
          "Access-Control-Allow-Credentials": true
        });
        res.end();
      }
    }
  });
  // listen for user connection


  io.on('connection', function (socket) {
    console.log('connected');
    io.emit('hello', 'hellou');
    // send message on user connection
    socket.emit('hello', JSON.stringify({ message: 'Hello food lover' }));
    // listen for user diconnect
    socket.on('disconnect', () => console.log('a user disconnected'));
  });

  // register socket io inside strapi main object to use it globally anywhere
  strapi.io = io;

  // Functions for Sockets
  //TODO: sensorReading to the front-end
  strapi.emitSensorReading = (reading) => {
    io.emit('sensorReading', reading);
  };

  //TODO: sensorReading to the front-end
  strapi.emitNotificationsRefresh = (reading) => {
    io.emit('notificationsRefresh', reading);
  };
};
