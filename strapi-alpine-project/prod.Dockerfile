FROM strapi/base:alpine

WORKDIR /srv/app



RUN rm -rf node_modules

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

ENV NODE_ENV production

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
