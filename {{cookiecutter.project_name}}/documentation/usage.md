# USAGE

## SERVICE DEFAULT ADDRESS

* [Grafana](http://127.0.0.1:3000)
* [Monit](http://127.0.0.1:2812)
* [Admin](http://127.0.0.1:31337)
* [{{cookiecutter.project_name}}-webpack](http://127.0.0.1:8080)
* [{{cookiecutter.project_name}}](http://127.0.0.1:8000)

## DEV

```bash
$ npm run start
$ make server-dev
```

## PROD

```bash
$ make start-server-prod
$ make stop-server-prod
```

## TESTING

### CLIENT

```bash
$ npm run test
$ npm run test:watch
```

### SERVER

```bash
$ make test
$ make test-debug
$ server-cwd => last-report.html
```


## ADMIN SERVER

```bash
$ make admin-dev
$ make start-admin-prod
$ make stop-admin-prod
```

## DEPS

```bash
$ make deps
$ make deps-dev
```

## BUILD

### DEV

```bash
$ npm run build:dev
```

### TRAVIS

```bash
$ npm run build:travis
```

### PROD

```bash
$ npm run build:prod
```

## QUEUE

```bash
$ make queue-dev
$ make start-queue-prod
$ make stop-queue-prod
```

## PROMETHEUS

```bash
$ make prometheus-dev
$ make start-prometheus-prod
$ make stop-prometheus-prod
```

## CREATE NEW MODEL

```bash
$ make new-model
```

## CREATE NEW ROUTE

```bash
$ make new-route
```

## LINT / FLAKE8 / STATS

```bash
$ make lint
$ make stats
$ npm run profile
```

## OTHERS

```bash
$ make serve-cwd
$ make query
$ make reset-db
$ make init-db-sample-data
```

{%- if cookiecutter.include_cordova %}
## CORDOVA

```bash
$ npm install -g cordova
$ cordova platform add %PLATFORM% # android, browser, ios
$ cordova build android
$ cordova run android
$ cordova run --debug --emulator ios
```
{%- endif %}
