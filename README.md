# Olimpiadas Parser #

[ ![Codeship Status for fabiohbarbosa/olimpiadas-web](https://codeship.com/projects/410f10d0-2398-0134-6df2-42c0bd32b4e6/status?branch=master)](https://codeship.com/projects/161279)

# Dependencies
* Node.js 6.2.2 or higher
* Docker
* Docker Compose
* Heroku Toolbelt

## Install
```sh
# clone this repository
git clone git@github.com:fabiohbarbosa/olimpiadas-web.git

# install dependencies
npm install
```

## Run in dev
```sh
npm run start-dev
```

## Validate
```sh
npm run validate
```

## Heroku

### Logs
```sh
heroku logs -t --app olimpiadas-web
```

## Heroku
```sh
# Git
git remote add heroku git@heroku.com:olimpiadas-web.git

# Heroku app
heroku git:remote -a olimpiadas-web

# Config
heroku:config
```

## Mongo
```sh
docker exec -it mongo-olimpiadas-web mongo mongo.host:mongo.port/mongo.database -u mongo.username -p mongo.password
```
