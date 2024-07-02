FROM node:latest
WORKDIR /client
COPY ./simgui/package*.json ./
RUN npm install
COPY ./simgui .
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR ../

