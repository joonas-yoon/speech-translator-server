FROM mhart/alpine-node:10.13.0
COPY . /src
RUN  cd /src/backend; npm install
RUN  cd /src/frontend; npm install

WORKDIR /src
RUN npm run build
RUN npm install

EXPOSE 8080
CMD npm start
