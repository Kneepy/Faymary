FROM node:lts-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . . 

RUN npm run build

EXPOSE 5005

CMD ["npm", "run", "start:pord"]