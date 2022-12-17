FROM node:latest

WORKDIR /usr/mqtt_client

COPY package* ./

RUN npm install

COPY ./src ./src

CMD ["npm", "start"]