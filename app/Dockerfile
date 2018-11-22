FROM mhart/alpine-node:10.13.0
COPY backend /src
RUN  cd /src; npm install
EXPOSE 3000
WORKDIR /src

CMD node index.js
