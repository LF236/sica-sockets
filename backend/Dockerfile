FROM node:latest

ARG user
ARG uid

RUN mkdir /code
WORKDIR /code

RUN npm install pm2@latest -g

ADD run.sh /code
RUN chmod +x run.sh

RUN mkdir /app
WORKDIR /app

EXPOSE 9090

CMD  /bin/bash -c '/code/run.sh' && /bin/bash
