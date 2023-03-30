FROM node:lts

WORKDIR /broker

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

COPY ./dist ./dist

CMD ["npm", "run", "start:prod"]