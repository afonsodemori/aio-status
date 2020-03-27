# 1.5.1, 2020-03-27
  - Move all public files to /docs
  - Add docker configuration

# 1.5.0, 2019-12-05
  - [feature] Add possibility use new UptimeRobot's "Read-Only API Key" to get all monitors at once

# 1.4.7, 2019-10-15
  - Forgot to update README.md :unamused:

# 1.4.6, 2019-10-15
  - Update api-keys
  - Update api endpoint

# 1.4.5, 2019-03-04
  - Add api key for srv-ops, srv-rpi, and rename home.afonso.io to srv-rpi.afonso.io

# 1.4.4, 2019-03-03
  - Add api key for home.afonso.io

# 1.4.3, 2019-02-28
  - [bugfix] Fix day count
  - Increase ajax timeout

# 1.4.2, 2019-02-25
  - Add api keys for api.sophia.afonso.io and pma.afonso.io

# 1.4.1, 2019-02-25
  - Add api key for api.status.afonso.io

# 1.4.0, 2019-02-22
  - [feature] Call own API to reduce number of requests; fallback to UptimeRobot's API if own API is unavailable
  - [bugfix] Fix wrong day range count
  - Add page for error 404
  - Remove integrity check from js and css

# 1.3.3, 2019-02-19
  - Remove logo and text-shadow from header
  - Change last 24h column to last 7d
  - Avoid summary waiting to have .fixed to change the status color
  - Change icons for not-checked-yet, seems-down and down
  - Change colors for monitor paused and not checked yet
  - Set timeout for ajax api requests
  - Fix theme color for about.html; change theme color in app.manifest

# 1.3.2, 2019-02-18
  - [hotfix] Fix assets URLs in service-worker.js

# 1.3.1, 2019-02-18
  - Add navbar
  - Create /about.html page and README.md
  - Fix mobile theme color for monitor-up

# 1.3.0, 2019-02-17
  - [feature] Add offline support
  - [bugfix] Fix count of paused/unknown monitors
  - Add notification when ajax request is not successful
  - Update favicons according to status
  - Fix data fetched from API, fix color coherence, add data columns
  - Keep the summary bar fixed when scrolling the page
  - Improve UX and change last downtime column to last status

# 1.2.0, 2019-02-16
  - [feature] New layout (add header, footer and UX improvements)
  - [feature] Add stats to the top of the page
  - [feature] Change color scheme according to the up/down status

# 1.1.0, 2019-02-15
  - [feature] Add column latest downtime
  - Add status.afonso.io to the list of services
  - Add countdown
  - Add viewport and improve mobile view
  - Add column for 15 days ratio
  - Improve UX on displaying uptime ratios
  - Add favicon.ico and robots.txt
  - Load api keys from external file
  - Create home template and fill it via jquery

# 1.0.0, 2019-02-14
  - Add basic implementation of status page
