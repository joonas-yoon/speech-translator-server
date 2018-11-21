FROM mhart/alpine-node:10.13.0
COPY package.json /src/package.json  
RUN  npm config set registry https://registry.npmjs.org/
RUN  echo "127.0.0.1 localhost" >> /etc/hosts && echo "8.8.8.8 localhost" >> /etc/hosts
RUN  cd /src; npm install  
COPY . /src  
EXPOSE 3000 
WORKDIR /src

CMD node index.js
