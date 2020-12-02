FROM node:12.18.4-buster
WORKDIR /usr/src/app

COPY . .
RUN yarn install && yarn build

ENV NODE_ENV production

EXPOSE 8080

CMD [ "node", "dist/entrypoints/ws.js" ]
