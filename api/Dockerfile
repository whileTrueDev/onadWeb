FROM node:14-alpine
ENV NODE_ENV production

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /home/api_server
WORKDIR /home/api_server
COPY ./dist /home/api_server/dist
COPY ./yarn.lock /home/api_server/yarn.lock
COPY ./package.json /home/api_server/package.json

RUN yarn install --prod

EXPOSE 3000 587

CMD NODE_ENV=production yarn start:prod