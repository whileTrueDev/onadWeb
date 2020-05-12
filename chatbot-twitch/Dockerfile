FROM node:12.16.1-alpine
ENV NODE_ENV production

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /home/twitchChat
WORKDIR /home/twitchChat
COPY ./dist /home/twitchChat/dist
COPY ./package.json /home/twitchChat/package.json
RUN yarn
CMD yarn start:production