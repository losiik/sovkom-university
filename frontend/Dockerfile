FROM node:alpine

WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .

COPY . .

RUN npm install && \
    npm run build
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]
