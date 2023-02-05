## Requirements

1. Docker
1. npm (v8) (to start the scripts)
1. [polygon.io](https://polygon.io/) api key
1. `.env` file (copy `.env.template` content to `.env` file). You need to change 2 variables there:

```
SESSION_PWD=randomStringHereNotLessThan32chars
POLYGON_API_TOKEN=(api key from polygon.io)
```

### Running

1. run `npm run docker:start` in root. This should be enough to bootstrap the project. App is available at [localhost:3000](http://localhost:3000)

### Running for development

1. (use node v18/npm v8) run `npm i`
1. run `npm run docker:dev`

### Existing problems

1. Polygon is rate limiting after 5req/min. So the solution is limited in terms of amound of data (unless you have paid account on polygon then amount of tickers and bar data could be used in full bloom).
1. Candlestick charts don't have axis in generated pdf. That needs to be tackled. Axises in regular svg have a lot of logic for scaling them correctly into chart dimensions. With `react-pdf` it doesn't work, unfortunately.

### How it works

1. App is built with `nextjs`. There are some problems because of that.

- First one is not being able to store reports anywhere except in `/tmp` folder so it needs a proper file storage like s3, but it costs money.
- Another issue is some files are executed multiple times (could not figure out why) and hence they are not sharing the common state in `/pages/*` folder and outside of it.

2. App uses sticky sessions without explicit login so that multiple users could generate reports and not interfere with each other and also not breaching the security (1 user can't download or see reports from other user).
3. App uses `socket.io` for communicating report generation progress.
4. App uses `redis` for generate report job queue and for session related data (reports statuses, user socket id).
5. App uses material ui components.
6. App uses `react-pdf` lib for pdf generation. Generated pdfs are quite primitive, but that could be tuned.
7. App uses some `d3-*` components to build axises.
