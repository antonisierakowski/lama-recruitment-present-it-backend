FROM node:12.18.4-buster
WORKDIR /usr/src/app

COPY install-packages.sh .
RUN chmod +x install-packages.sh
RUN ./install-packages.sh

COPY . .
RUN yarn install && yarn build

ENV NODE_ENV production

EXPOSE 8000 8080

CMD [ "node", "dist/run.js" ]
