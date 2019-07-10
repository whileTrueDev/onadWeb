FROM nginx:1.14.2-alpine

COPY ./build /var/www/react.onad.com
COPY ./nginx.conf /etc/nginx/conf.d/react.onad.com

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]