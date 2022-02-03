FROM node:16
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN yarn install --production
COPY ./dist ./dist

EXPOSE 3333
CMD yarn start