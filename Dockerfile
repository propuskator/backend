FROM node:14.16-alpine

WORKDIR /app

RUN apk add --no-cache \
    ffmpeg \
    git \
    python3 \
    tzdata

COPY package*.json ./

RUN npm ci

COPY etc etc
COPY lib lib
COPY bin bin
COPY assets assets
COPY migrations migrations
COPY app.js ./
COPY runner.js ./
COPY babel.config.js ./
COPY .sequelizerc ./
COPY .env.defaults ./

CMD ./bin/wait.sh && npm run migration:dev && npm start
