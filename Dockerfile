FROM node:alpine

# Add Bash
RUN apk add --no-cache bash

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN yarn install

# Bundle app source
COPY . /usr/src/app

# Start serving files using yarn start
CMD ["npm", "start"]