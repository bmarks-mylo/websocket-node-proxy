FROM node:6

ENV NODE_ENV production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY server.js /usr/src/app/
COPY public /usr/src/app/public

RUN npm install

EXPOSE 8080
CMD ["node", "server.js"]