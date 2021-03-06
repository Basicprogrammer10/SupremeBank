FROM node:14

WORKDIR /usr/src/Supreme-Bank
COPY package*.json ./
RUN npm install
COPY src/ .
CMD [ "node", "index.js" ]