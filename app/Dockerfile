FROM mhart/alpine-node:10.13.0
COPY package.json /src/package.json
RUN  echo "104.16.109.30 www.npmjs.com registry.npmjs.org" >> /etc/hosts
RUN  cd /src; npm install
COPY ./backend /src
EXPOSE 3000
WORKDIR /src

CMD node index.js
