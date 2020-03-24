FROM node:10.15.3-alpine
ENV NODE_ENV production
RUN mkdir -p /home/onad_socket
WORKDIR /home/onad_socket
ADD . /home/onad_socket
RUN yarn
EXPOSE 3002
CMD NODE_ENV=production yarn start:production