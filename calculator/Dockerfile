FROM node:10.15.3-alpine
ENV NODE_ENV production
RUN mkdir -p /home/calculator
WORKDIR /home/calculator
ADD . /home/calculator
RUN yarn
EXPOSE 3060
CMD NODE_ENV=production yarn start