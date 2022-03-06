'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createBulk: async ctx => { 
    if (Array.isArray(ctx.request.body)) { 
      return await Promise.all(ctx.request.body.map(strapi.services['planned-maintenance'].create)).catch(err => console.error(err)); 
    } 
    else return strapi.services['planned-maintenance'].create(ctx.request.body);  
  }
};
