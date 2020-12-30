# Python support can be specified down to the minor or micro version
# (e.g. 3.6 or 3.6.3).
# OS Support also exists for jessie & stretch (slim and full).
# See https://hub.docker.com/r/library/python/ for all supported Python
# tags from Docker Hub.
FROM python:3.8-slim-buster

# If you prefer miniconda:
#FROM continuumio/miniconda3

LABEL Name=afreeca_link_note_crawler Version=0.0.3

ENV PYTHON_ENV production

WORKDIR /app
ADD . /app

RUN apt-get -y update && \
    apt-get install -y \
    wget \
    gnupg2

# Adding trusting keys to apt for repositories
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -

# install manually all the missing libraries
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

# Adding Google Chrome to the repositories
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'

# install chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install

# Updating apt to see and install Google Chrome
RUN apt-get -y update && \
    apt-get install -y google-chrome-stable

# Using pip:
RUN python3 -m pip install -r requirements.txt
CMD ["python3", "run.py"]

