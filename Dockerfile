FROM node:12.18.4-buster
WORKDIR /usr/src/app

COPY install-packages.sh .
RUN chmod +x install-packages.sh
RUN ./install-packages.sh

COPY . .
RUN yarn install && yarn build

EXPOSE 8000 8080

ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

CMD [ "node", "dist/run.js" ]
