FROM node:16.0.0
RUN apt update && apt -y install libboost-all-dev
COPY package*.json .
RUN npm install
WORKDIR /usr/src/app
COPY index.js .
CMD ["node", "index.js"]