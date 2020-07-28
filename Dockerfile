FROM node:12.18.2-alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 8000 8080
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
CMD [ "node", "dist/run.js" ]
