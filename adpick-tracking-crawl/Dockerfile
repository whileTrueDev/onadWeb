FROM onad_adpick:latest
ENV LC_ALL=C.UTF-8
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update
RUN apt-get install google-chrome-stable
RUN apt-get install python3-pip

RUN mkdir -p /adpick_crawler
WORKDIR /adpick_crawler
ADD . /adpick_crawler
RUN pip3 install -r requirements.txt

EXPOSE 3070
CMD python3 run.py