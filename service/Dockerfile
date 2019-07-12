FROM nginx:1.14.2-alpine

COPY . /var/www/api.onad.com
COPY ./nginx.conf /etc/nginx/conf.d/test.api.onad.com.conf
ENV NODE_ENV production

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]