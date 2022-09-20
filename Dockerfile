FROM node:18-alpine

WORKDIR /app

COPY package.json package.json

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]