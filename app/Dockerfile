FROM node:10.13.0-slim
COPY . /src
RUN  cd /src/backend; npm install
RUN  cd /src/frontend; npm install

EXPOSE 3000
WORKDIR /src
RUN npm run build
CMD npm run server
