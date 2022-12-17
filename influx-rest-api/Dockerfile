FROM node:latest

WORKDIR /usr/backend/

COPY package* ./

RUN npm install

COPY ./src ./src 

CMD ["npm", "start"]