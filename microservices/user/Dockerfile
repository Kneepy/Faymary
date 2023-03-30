# init db
FROM mysql 

ENV MYSQL_DATABASE user
ENV MYSQL_ROOT_PASSWORD root

# init project
FROM node:lts

WORKDIR /user
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
COPY ./dist ./dist
CMD ["npm", "run", "start:prod"]