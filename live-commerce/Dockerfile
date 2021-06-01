FROM node:12.16.1-alpine
ENV NODE_ENV production

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /home/live_commerce
WORKDIR /home/live_commerce
ADD . /home/live_commerce
RUN yarn

EXPOSE 3060
CMD NODE_ENV=production yarn start:production