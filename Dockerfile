FROM node:18.15.0-alpine3.17

RUN npm install -g nodemon

WORKDIR /usr/queenpins/queenpins-api

COPY package.json .

RUN npm install

COPY . .

# EXPOSE 1337 required for docker desktop port mapping

# CMD ["/bin/bash"] to open terminal (it helpful when we just start create container, after check every ok we can ignore this CMD) (need to use with -i and -t or -it when docker run)
CMD ["node", "src/server.js"]
# CMD ["nodemon", "src/server.js"]
