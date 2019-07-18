FROM node:10.15.3-alpine
ENV NODE_ENV production
RUN mkdir -p /home/socket_server
WORKDIR /home/socket_server
ADD . /home/socket_server
RUN yarn
EXPOSE 3002
CMD NODE_ENV=production yarn start:production