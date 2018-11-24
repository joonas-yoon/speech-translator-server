FROM mhart/alpine-node:10.13.0
COPY . /src
RUN  cd /src/backend; npm install
RUN  cd /src/frontend; npm install
RUN  cd /src; npm install

WORKDIR /src
EXPOSE 3000
CMD npm start
