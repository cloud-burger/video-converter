FROM node:20.14-slim

RUN mkdir -p /app
RUN chown node /app

WORKDIR /app

USER node

COPY --chown=node:node . .

RUN npm install
RUN npm run build
RUN rm -rf src
RUN apt update
RUN apt install ffmpeg -y