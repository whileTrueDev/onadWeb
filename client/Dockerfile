FROM nginx:1.14.2-alpine

COPY build /var/www/onad.io
COPY nginx.conf /etc/nginx/conf.d/onad.io.conf
ENV NODE_ENV production

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]