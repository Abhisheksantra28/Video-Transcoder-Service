FROM ubuntu:focal

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

RUN apt-get install -y ffmpeg 


WORKDIR /app

COPY index.js index.js
COPY utils/ utils/
COPY package*.json .

RUN npm install

CMD ["node", "index.js"]
