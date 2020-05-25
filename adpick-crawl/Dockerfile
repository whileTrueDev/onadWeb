FROM node:12.16.1-alpine

ENV NODE_ENV production

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /home/adpick
WORKDIR /home/adpick
COPY ./dist /home/adpick/dist
COPY ./yarn.lock /home/adpick/yarn.lock
COPY ./package.json /home/adpick/package.json

RUN yarn install --prod
CMD NODE_ENV=production yarn start:production