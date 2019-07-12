FROM nginx:1.14.2-alpine

COPY ./build /var/www/onad.com
COPY ./nginx.conf /etc/nginx/conf.d/onad.com.conf
ENV NODE_ENV production

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]