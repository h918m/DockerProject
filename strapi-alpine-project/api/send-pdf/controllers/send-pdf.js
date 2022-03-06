'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const fs = require('fs');

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    // Get the fields from the body
    // const { data } = ctx.request.body;

    // Send mail
    // send an email by using the email plugin
    // await strapi.plugins['email'].services.email.send({
    //   to: 'vadimdev8@gmail.com',
    //   from: 'no-reply@searuuk.uk',
    //   subject: 'Exported PDF is arrived',
    // }).then(res => {
    //   console.log("success======", res)
    // }).catch(err => {
    //   console.log("err=========", JSON.stringify(err))
    // });



    let entity;
    if (ctx.is('multipart')) {
      const {data, files} = parseMultipartData(ctx);
      const file = files.pdf;
      const filePath = file.path;
      const attachment = fs.readFileSync(filePath);
      fs.writeFileSync("/attachment.pdf", attachment);
      const realAttachment = fs.readFileSync("/attachment.pdf").toString("base64");

      console.log("Succesfully read file");

      const res = await strapi.plugins['email'].services.email.send({
        to: data.mail,
        from: 'no-reply@searuuk.uk',
        subject: 'Exported PDF is arrived',
        attachments: [
          {
            filename: "attachment.pdf",
            content: realAttachment,
            type: "application/pdf",
            disposition: "attachment",
            path: "/attachment.pdf"
          }
        ]
      }).then((res) => {
        console.log("success======", res)
      });


      entity = await strapi.services['send-pdf'].create(data, {files});
      console.log("successfully saved to back-end");
    } else {
      entity = await strapi.services['send-pdf'].create(ctx.request.body);
    }


    return sanitizeEntity(entity, {model: strapi.models['send-pdf']});
  },
};
