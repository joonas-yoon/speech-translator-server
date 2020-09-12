# Speech Translator Server

<div align="center">

![Logo](https://github.com/joonas-yoon/speech-translator/raw/0912f8685622e65900d88ebbbc5b0da91bec814c/docs/images/logo.png)

</div>

<div align="center">

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/68253fb653984af9a9b5f4783b45a316)](https://app.codacy.com/manual/joonas-yoon/speech-translator-server?utm_source=github.com&utm_medium=referral&utm_content=joonas-yoon/speech-translator-server&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/joonas-yoon/speech-translator-server.svg?branch=master)](https://travis-ci.org/joonas-yoon/speech-translator-server)

</div>

API Server for [@joonas-yoon/speech-translator](https://github.com/joonas-yoon/speech-translator)

The server is developed as pipeline for automated request and response to reconize speech(STT) and translate it.

<div align="center">

![architecture](https://user-images.githubusercontent.com/9527681/90546588-40314880-e1c5-11ea-933b-555655be93b4.png)

</div>


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

export your environment valuables before running application: [`environment/development.env`](./environment/development.env)

```
export $(cat ../environment/development.env)
```

or fill in the fields: [`app/backend/configs/index.js`](./app/backend/configs/index.js)

### Backend

Framework: node.js

[`~/app/backend/`](./app/backend/README.md)

### Frontend

Framework: Vue.js

[`~/app/frontend/`](./app/frontend/README.md)

nothing yet.

### Deploy with docker containers
```
$ sudo apt install docker docker-compose -y
$ sudo docker build --tag node-app .
$ sudo docker-compose up -d
```

Note: It uses environment variables in production mode with [`environment/production.env`](./environment/production.env)

### Finally

If you get "Hello World" when following command, it works fine.

```
$ curl http://localhost/
Hello World!
```

## Video

[client for Google Chrome Extension](https://github.com/joonas-yoon/speech-translator)

[![Video v1.3.1](https://img.youtube.com/vi/GaV_2DHSElM/0.jpg)](https://youtu.be/GaV_2DHSElM)

Youtube: https://youtu.be/GaV_2DHSElM
