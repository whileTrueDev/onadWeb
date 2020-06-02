FROM adpick_crawler:latest

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update
RUN apt-get install google-chrome-stable

RUN mkdir -p /adpick_crawler
WORKDIR /adpick_crawler
ADD . /adpick_crawler
RUN pip install -r requirements.txt

EXPOSE 3070
CMD python3 run.py