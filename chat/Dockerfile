FROM node:10.15.3-alpine
ENV NODE_ENV production
RUN mkdir -p /home/twitchChat
WORKDIR /home/twitchChat
ADD . /home/twitchChat
RUN yarn
CMD NODE_ENV=production yarn start