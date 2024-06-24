FROM node:current-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . . 

RUN npm run build

EXPOSE 5003

CMD ["npm", "run", "start:pord"]