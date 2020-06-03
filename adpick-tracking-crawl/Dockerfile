FROM python:3.8.2

ENV LC_ALL=C.UTF-8

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get -y update
RUN apt-get install -y google-chrome-stable
RUN apt-get install -y xvfb
RUN rm -rf /etc/apt/sources.list.d/google.list

RUN mkdir -p /adpick_crawler
WORKDIR /adpick_crawler
ADD . /adpick_crawler
RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python", "run.py" ]