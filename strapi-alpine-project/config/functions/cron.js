'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#cron-tasks
 */

const addPlannedMaintenanceTask = async (repeating) => {
  const results = await strapi.services['planned-maintenance'].find({repeating})
    .catch(err => console.error(err.response));

  for(let x = 0; x < results.length; x += 1){
    const currentResult = results[x];
    if (!currentResult.machine){
      currentResult.machine = {id: ''};
    }
    let userParams = [];
    for (let item of currentResult.users) {
      userParams.push(item.id)
    }
    await strapi.services['planned-maintenance-tasks'].create({
      type: currentResult.type,
      task: currentResult.task,
      component: currentResult.component,
      completed: false,
      machine: currentResult.machine.id,
      image: currentResult.image.id,
      users: userParams,
      comment: currentResult.comment,
      company: currentResult.company.id
    });
  }
};

module.exports = {
  // daily_at_9am
  '0 9 * * *': () => {
    return addPlannedMaintenanceTask('daily_at_9am');
  },

  // every_monday_at_9am
  '0 9 * * 1': async () => {
    return addPlannedMaintenanceTask('every_monday_at_9am');
  },

  // first_day_of_month
  '0 9 1 * *': async () => {
    return addPlannedMaintenanceTask('first_day_of_month');
  },

  // first_day_of_every_3_months
  '0 9 1 */3 *': async () => {
    return addPlannedMaintenanceTask('first_day_of_every_3_months');
  },

  // first_day_of_every_6_months
  '0 9 1 */6 *': async () => {
    return addPlannedMaintenanceTask('first_day_of_every_6_months');
  },
  // first_day_of_every_year
  '0 0 1 1 *' : async () => {
    return addPlannedMaintenanceTask('first_day_of_every_year');
  },
  // // every_minute
  // '* * * * *': async () => {
  //   // Only used for testing
  //   return addPlannedMaintenanceTask('every_minute');
  // },
  // // first_day_of_every_second_year
  // '0 0 0 1 1 ? 2020/2': async () => {
  //   return addPlannedMaintenanceTask('first_day_of_every_second_year');
  // }
};
