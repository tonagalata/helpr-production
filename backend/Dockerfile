FROM python:3.9-bullseye

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
COPY ./Procfile /app/Procfile

RUN apt-get update \
    && apt-get install gcc -y \
    && apt-get clean

RUN pip install --upgrade pip wheel

RUN pip install -r /app/requirements.txt \
    && rm -rf /root/.cache/pip

COPY . /app/
