# Python support can be specified down to the minor or micro version
# (e.g. 3.6 or 3.6.3).
# OS Support also exists for jessie & stretch (slim and full).
# See https://hub.docker.com/r/library/python/ for all supported Python
# tags from Docker Hub.
FROM python:3.8.2

# If you prefer miniconda:
#FROM continuumio/miniconda3

LABEL Name=afreeca_link_note_crawler Version=0.0.3

# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# env 설정
ENV PYTHON_ENV production

WORKDIR /app
ADD . /app

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get -y update
RUN apt-get install -y google-chrome-stable
RUN rm -rf /etc/apt/sources.list.d/google.list


# Using pip:
RUN python3 -m pip install -r requirements.txt
CMD ["python3", "run.py"]
