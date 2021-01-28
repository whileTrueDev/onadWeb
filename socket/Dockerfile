FROM node:12.16.1-alpine
ENV NODE_ENV production

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /home/onad_socket
WORKDIR /home/onad_socket
ADD . /home/onad_socket
RUN yarn

EXPOSE 3002

CMD NODE_ENV=production yarn start:production