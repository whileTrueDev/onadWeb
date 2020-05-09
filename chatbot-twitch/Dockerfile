FROM node:12.16.1-alpine
ENV NODE_ENV production
RUN mkdir -p /home/twitchChat
WORKDIR /home/twitchChat
COPY ./dist /home/twitchChat/dist
COPY ./package.json /home/twitchChat/package.json
RUN yarn
CMD yarn start:production