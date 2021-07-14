FROM node:14-alpine
ENV NODE_ENV production

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apk update && apk add curl && apk --no-cache add python2
# google-sdk
RUN curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz
RUN mkdir -p /usr/local/gcloud \
  && tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz \
  && /usr/local/gcloud/google-cloud-sdk/install.sh
ENV PATH $PATH:/usr/local/gcloud/google-cloud-sdk/bin

RUN apk del python2 && apk --no-cache add python3

RUN mkdir -p /home/live_commerce
WORKDIR /home/live_commerce
ADD . /home/live_commerce
RUN yarn

EXPOSE 3060
CMD NODE_ENV=production yarn start:production
