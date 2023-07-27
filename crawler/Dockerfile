FROM node:18

WORKDIR /crawler_server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]