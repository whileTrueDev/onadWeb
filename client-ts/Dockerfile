FROM nginx:1.14.2-alpine


# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./build /var/www/onad.io
COPY ./nginx.conf /etc/nginx/conf.d/onad.io.conf

ENV NODE_ENV production

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]