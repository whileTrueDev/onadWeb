FROM nginx:1.14.2-alpine

COPY ./build /var/www/cpa.onad.io
COPY ./nginx.conf /etc/nginx/conf.d/cpa.onad.io.conf
ENV NODE_ENV production

EXPOSE 3011

CMD ["nginx", "-g", "daemon off;"]