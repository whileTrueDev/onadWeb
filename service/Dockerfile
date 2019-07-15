FROM node:latest
ENV NODE_ENV production
RUN mkdir -p /home/api_server
WORKDIR /home/api_server
ADD . /home/api_server
RUN yarn
EXPOSE 3000
CMD yarn start