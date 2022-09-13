FROM node:18-alpine

WORKDIR /app

COPY package.json package.json

RUN yarn

RUN yarn build

COPY . .
