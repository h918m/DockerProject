FROM mhart/alpine-node:12.16.2

# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
# RUN apk add --no-cache tini
# ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /app

RUN pwd

RUN rm -rf node_modules

COPY . .

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python

RUN yarn install

EXPOSE 8080

# TODO this to be changed
CMD ["yarn", "docker"]