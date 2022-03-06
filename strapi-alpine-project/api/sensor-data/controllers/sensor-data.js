'use strict';
const {sanitizeEntity} = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
//TODO: check if the data exceed the range
function checkIfExceed(sensor, value) {
  let range = sensor.range;
  return value > range.maximum || value < range.minimum;
}

module.exports = {


  async create(ctx) {
    //TODO: check if this comes from call-button sensor
    // then if this comes from call-button it will create new data in the Notifications content
    // in the Notifications, it will check the user id and the status "clicked"
    // when normal user logins, it will check the notifications table according to his user id and the status is false
    // then the website will list the whole items in the dropdown list
    // once user click some item, the status of the data will be changed to true


    // Get the fields from the body
    let {topic, data} = ctx.request.body;
    if (typeof (data) === 'string') {
      data = JSON.parse(data);
    }
    let mac = '';
    try {
      mac = topic.split('/').pop();
    } catch (err) {
      console.error('Error getting mac address from topic', err + 'Topic: ' + topic);
      return null;
    }
    //Get data model for MAC address
    return strapi.services['sensors-to-models'].find({
      MAC: mac,
      '_limit': 1
    }).then(async (sensorToModel) => {
      if (sensorToModel.length > 0) {
        let formattedData = {};
        try {
          // Object.entries(sensorToModel[0].sensorModelInfo.dataModel).forEach(([key, val]) =>{
          //   formattedData[val] = data[key];
          // });

          //TODO: check sensor's model and extract data for the specific key

          let sensor = sensorToModel[0];
          let machine = sensorToModel[0].machine;


          async function addPM() {
            if (checkIfExceed(sensor, data['value'])) {
              let users = sensor.machine.users;
              let company = sensor.company.id;
              const entity1 = await strapi.services['planned-maintenance-tasks'].create({
                users: users,
                type: 'mechanical',
                machine: machine.id,
                task: ' ',
                component: ' ',
                comment: ' ',
                company: company
              });
              sanitizeEntity(entity1, {model: strapi.models['planned-maintenance-tasks']});
              if (users.length > 0) {
                for (let i=0; i < users.length; i++) {
                  const entity = await strapi.services['notification'].create({
                    eventDescription: `Exceeded range from ${machine.name}`,
                    checked: false,
                    user: users[i],
                  });
                  sanitizeEntity(entity, {model: strapi.models['notification']});

                }
                strapi.emitNotificationsRefresh({
                  data: "here"
                });
              }
            }
          }
          let customModelValue = sensor.customModelValue;
          if (!sensor.customModel) {
            if (sensor.model === 'temperature') {
              await addPM();
              formattedData['temperature'] = data['value']
            } else if (sensor.model === 'vibration') {
              await addPM();
              formattedData['vibration'] = data['value']
            } else if (sensor.model === 'current') {
              await addPM();
              formattedData['current'] = data['value']
            } else if (sensor.model === 'indicator') {
              formattedData['indicator'] = data['value']
            } else if (sensor.model === 'call') {
              let users = sensor.machine.users;
              let company = sensor.company.id;
              let admins =await strapi.query('user', 'users-permissions').find(
                {company: company, level: 1}
              );
              admins.forEach(item => {
                users.push(item.id)
              });
              if (users.length > 0) {
                for (let i=0; i < users.length; i++) {
                  const entity = await strapi.services['notification'].create({
                    eventDescription: `Call button is clicked from ${machine.name}`,
                    checked: false,
                    user: users[i],
                  });
                  sanitizeEntity(entity, {model: strapi.models['notification']});
                }
                strapi.emitNotificationsRefresh({
                  data: "here"
                });
                return true;
              } else {
                return null;
              }
            }

          } else {
            await addPM();
            formattedData[customModelValue.name] = data['value']
          }
        } catch (err) {
          return null;
        }

        // Emits socket info to all clients
        strapi.emitSensorReading({
          MAC: mac,
          formattedData
        });
        // Set fields in DB
        const entity = await strapi.services['sensor-data'].create({
          data: data,
          topic: topic,
          MAC: mac,
          value: data['value'],
          formattedData: formattedData
        });

        // Sanitize removes passwords etc.
        return sanitizeEntity(entity, {model: strapi.models['sensor-data']});
      }
      console.error('Sensor not matching any Sensor Model', 'Topic:' + topic);
      return null;
    }).catch((err) => {
      console.error('Error populating sensor data', err);
      return null;
    });
  }
};
