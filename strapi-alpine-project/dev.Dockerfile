FROM strapi/base:alpine

WORKDIR /srv/app

RUN pwd

RUN rm -rf node_modules

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

ENV NODE_ENV development

RUN yarn build

EXPOSE 1337

CMD ["yarn", "develop"]
