'use strict';
const { sanitizeEntity } = require('strapi-utils');
const stripe = require('stripe')('sk_test_51I3HBHLZAfZEWAJW0RJO6cviFqRDwpiRtrZbCAiXmYDaMbLx3CvUYssPUsMPXBgE6jNg7ZmTnALrMdz8L4XiwcHN00QYJrKhX9');
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async ctx => {
    const {
      company,
      amount,
      token
    } = ctx.request.body;

    // Charge the customer

    await stripe.charges.create({
      // Transform cents to dollars.
      amount: amount * 100,
      currency: 'usd',
      description: `Order ${new Date()} by ${ctx.state.user.id} - ${ctx.state.user.email}`,
      source: token,
    }).then(async (res) => {
      await strapi.query('company').update({id: company}, {
        membership: 1
      });

      //create prder
      const orderRes = await strapi.services.order.create({
        company,
        amount,
        token
      });
      return sanitizeEntity(orderRes, {model: strapi.models['sensor-data']});
    }).catch(err => {
      return null;
    });
    // Register the order in the database

  },
};
