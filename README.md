# Speech Translator Server

<p align="center">
  <img src="https://github.com/joonas-yoon/speech-translator/raw/master/logo.png" alt="logo"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.2-blue.svg" alt="version-1.2.4"/>
  <a href="https://travis-ci.org/joonas-yoon/speech-translator-server"><img src="https://travis-ci.org/joonas-yoon/speech-translator-server.svg?branch=master" alt="Build Status"/></a>
</p>

API Server for [@joonas-yoon/speech-translator](https://github.com/joonas-yoon/speech-translator)

The server is developed as pipeline for automated request and response to reconize speech(STT) and translate it.

<p align="center">
  <img src="https://user-images.githubusercontent.com/9527681/90546588-40314880-e1c5-11ea-933b-555655be93b4.png" alt="architecture" />
</p>


## Get Started

### Set up

It needs credential to use Google Cloud APIs, so we need to write `key.json` for authenticating.

[This document](https://cloud.google.com/video-intelligence/docs/common/auth#using-api-manager) helps you to get credentials as json file.

and copy & paste it. (or send it)

```
$ vi key.json

{
  "type": "service_account",
  "project_id": "project-id",
  "private_key_id": "some_number",
  ...
}
```

also copy our [samples/node-configs.js](https://github.com/joonas-yoon/speech-translator-server/blob/master/samples/node-configs.js) to `configs/index.js`, and fill in the fields.

```
$ mkdir app/backend/configs
$ cp samples/node-configs.js app/backend/configs/index.js
```

### Deploy with docker containers
```
$ sudo apt install docker docker-compose -y
$ sudo docker build --tag node-app .
$ sudo docket-compose up -d
```

### Finally

If you get "Hello World" when following command, it works fine.

```
$ curl http://localhost/
Hello World!
```

## Preview with [client for Google Chrome Extension](https://github.com/joonas-yoon/speech-translator)

[![Video v1.2](https://img.youtube.com/vi/Dry5jo6nQF4/0.jpg)](https://youtu.be/Dry5jo6nQF4)

Youtube: https://youtu.be/Dry5jo6nQF4
