## Requirements

1. Docker (precisely docker-compose)
1. npm (v8) (to start the scripts)
1. [polygon.io](https://polygon.io/) api key
1. `.env` file (copy `.env.template` content to `.env` file). You need to change 2 variables there:

```
SESSION_PWD=randomStringHereNotLessThan32chars
POLYGON_API_TOKEN=(api key from polygon.io)
```

### Running

1. run `npm run docker:start` in root. This should be enough to bootstrap the project. App is available at [localhost:3000](http://localhost:3000)
1. Be advised that app uses ports `3000` (for nextjs part) and `6379` (for redis) which are bound to same host machine ports. You might get `port is already being used` error. So either stop local processes with same ports or change the [compose.common.yml](./compose.common.yml) ports sections for affected services.

### Running for development

1. use node v18
1. run `npm i`
1. run `npm run docker:dev`

### What it can do
1. It can generate pdf reports for 3 tickers (sorted by ticker alphabetically). It could have been made configurable, but it was made with this idea in mind.
1. It can show candlestick chart for first 20 tickers (sorted by ticker alphabetically) for either week/month/year. Ideally tickers should have been searchable, but such limits are put because of free tier of polygon.io account in mind.

### Known issues

1. Polygon is rate limiting after 5req/min. So the solution is limited in terms of amound of data (unless you have paid account on polygon then amount of tickers and bar data could be used in full bloom).
1. Candlestick charts don't have axis in generated pdf. That needs to be tackled. Axises in regular svg have a lot of logic for scaling them correctly into chart dimensions. With `react-pdf` it doesn't work.

### What is used for app

1. Solution is built with `nextjs`. There are some problems because of that.

- First is not being able to store files anywhere except in `/tmp`. Proper file storage like s3 is needed, but that requires paid account.
- Another is that some source files are included into different bundles, hence not sharing the common state (e.g. it is not possible to set global variable in source file from api route and then use it in worker).

2. `iron-session` for sticky sessions without explicit login (userId assigned on first page visit and stays forever in cookies unless browser cookies are cleaned). One user can't see/download reports from other users.
3. `socket.io` for communicating report generation progress.
4. `redis` + `bull` + `redis-client` are used for report generating queue and for session related data (reports statuses, user socket id).
5. Few simple material ui components `@mui/material`.
6. `react-pdf` for pdf generation and rendering into file. Pdf layout and styles were intentionally left almost untouched.
7. `d3-*` components to build axises for candlestick charts (works only in web, not in pdf).
