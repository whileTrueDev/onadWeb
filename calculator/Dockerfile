FROM node:10.15.3-alpine
ENV NODE_ENV production

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /home/calculator
WORKDIR /home/calculator
ADD . /home/calculator
RUN yarn
EXPOSE 3060
CMD NODE_ENV=production yarn start