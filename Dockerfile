FROM node:18-alpine

WORKDIR /app

COPY package.json package.json

RUN yarn

COPY . .

EXPOSE 3000

RUN yarn build