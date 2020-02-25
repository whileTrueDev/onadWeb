FROM node:10.15.3-alpine
ENV NODE_ENV production
RUN mkdir -p /home/api_server
WORKDIR /home/api_server
COPY . /home/api_server
RUN yarn
EXPOSE 3000
CMD NODE_ENV=production yarn start:production