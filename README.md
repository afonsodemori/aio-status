# About

**Status Dashboard** is frontend to consume the data provided by [Uptime Robot](https://uptimerobot.com/about)'s API.

The project is hosted on Github Pages, so it "never" gets down. The api keys in the project are read-only, so it's not a problem letting them in the repository.

# Data source

The data is provided by Uptime Robot's API through read-only API keys. Each read-only key has access to a single monitor.

To avoid making as many requests as the number of monitors enabled, I created a wrapper, hosted on my server, with a full access key that makes a single request for all monitors at once.

The wrapper's source-code is available at https://github.com/afonsodemori/aio-status-api. In case this endpoint is down, the frontend falls back to Uptime Robot's API.

# API KEYS

UptimeRobot has now the option of a ReadOnly "Master Api Key" for getting read only information for all monitors at once.

More changes are coming to improve performance. For now, the file at `config/api-keys,json` can be configured as an array of monitor objects with `id`, `name` and `key` or with an array with a single monitor object with id = null, name = "MASTER-KEY" and your api key in the "key" property as below:

> When bringing all monitors with a master key, it's possible to hide specific monitors prefixing its name with `off-` in UptimeRobot's dashboard.

```json
[
  {
    "id": null,
    "name": "MASTER-KEY",
    "key": "{your-key}"
  }
]
```

# Links

  - Frontend: https://status.afonso.io
  - Frontend source: *(this repo)*
  - API: https://apis.afonso.io/status
  - API source:  https://github.com/afonsodemori/aio-status-api
