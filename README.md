# speech-translator-server

[Here](https://github.com/joonas-yoon/speech-translator) the client is as Google Chrome Extensions

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