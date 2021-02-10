FROM node:12.16.1-alpine
ENV NODE_ENV production

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /home/tracker
WORKDIR /home/tracker
COPY ./dist /home/tracker/dist
COPY ./yarn.lock /home/tracker/yarn.lock
COPY ./package.json /home/tracker/package.json
RUN yarn install --prod
EXPOSE 3030

CMD NODE_ENV=production yarn start:production