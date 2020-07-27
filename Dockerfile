FROM node:12.18.2-alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN yarn build
COPY . .
EXPOSE 8000 8080
CMD [ "node", "dist/run.js" ]
