## Requirements
- Ruby
- RubyGems/travis
```
sudo apt-get install ruby`ruby -e 'puts RUBY_VERSION[/\d+\.\d+/]'`-dev
sudo gem install travis
``` 

## Encrypting environment variables
- [document](https://docs.travis-ci.com/user/environment-variables/)
- add environment variables on `.travis.yml`

```
travis encrypt DOCKER_USERNAME=username --add env.global
travis encrypt DOCKER_PASSWORD=password --add env.global
travis encrypt $(cat environment/production.env) --add env.matrix
```

## Before install

Set `DOCKER_COMPOSE_VERSION` on your environment variables. we use docker-compose-1.17.1 on now (proejct-version: 1.2.2, November 2018)

```
before_install:
  # update is required to update the repositories to see the new packages for
  # Docker.
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  - sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  - sudo apt-get update

  # Now we can install the newer docker-engine which is required for the newer
  # docker-composer we will install next. The messy options are to force it to
  # be non-interactive (normally it asks you a bunch of config questions).
  - sudo apt-get -y install docker-ce

  # Print out the current docker-compose version. Once this reports 1.6+ then we
  # do not need the following steps.
  - docker-compose --version

  # As of the writing of this script Travis has docker-compose v1.4.2, we need
  # to update it to 1.8+. $DOCKER_COMPOSE_VERSION is provide from the `env`
  # above.
  - sudo rm /usr/local/bin/docker-compose
  - curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > docker-compose
  - chmod +x docker-compose
  - sudo mv docker-compose /usr/local/bin

  # Check that docker-compose is now running the latest version (or at least the
  # one we specified). This is not to be confused with the version we printed
  # before doing the update.
  - docker-compose --version

  # Update npm
  - curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
  - sudo apt-get install -y nodejs
  - sudo npm install -g npm
  - node -v && npm -v

  # Environments
  - echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

  # Setup your application stack. You may need to tweak these commands if you
  # doing out-of-the-ordinary docker-compose builds.
  - docker-compose build
  - docker-compose up -d
  - docker-compose logs -f

  # You will want this for logging. If one of your containers does not build for
  # whatever reason it's best to report that now before your tests start
  # otherwise it can be really tricky to debug why tests are failing sometimes.
  - docker ps
```
