FROM nginx:1.14.2-alpine

COPY ./build /var/www/l.onad.io
COPY ./nginx.conf /etc/nginx/conf.d/l.onad.io.conf
ENV NODE_ENV production

EXPOSE 3011

CMD ["nginx", "-g", "daemon off;"]