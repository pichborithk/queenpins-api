FROM node:18.15-apline

RUN npm install -g nodemon

WORKDIR /usr/queenpins/queenpins-api

COPY package.json .

RUN npm install

COPY . .

# EXPOSE 1337 required for docker desktop port mapping

# CMD ["node", "src/server.js"]
CMD ["nodemon", "-L", "src/server.js"]