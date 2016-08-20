# Api reference

Obtained by Man-in-the-Middle-ing the SofiaTraffic android app.

### Base url
`http://drone.sumc.bg/api/`

### Routes

#### POST `http://drone.sumc.bg/api/v1/timing`
- Parameters:
  - `stopCode=STOPCODE`
- Returns ETAs for next ~3 vehicles

#### POST `http://drone.sumc.bg/api/v1/timetable`
- Parameters:
  - `stopCode=STOPCODE`
- Returns the timetable for vehicles

#### POST `http://drone.sumc.bg/api/v1/routes/changes`
- Parameters:
  - `from_date=UNIX TIMESTAMP`
- Returns a JSON object (or 502, or [FatalErrorException](https://rawgit.com/cuklev/SofiaTransport/master/fun.html))
  - Probably useful information if have a local database with routes and need to update it
  - Contains coordinates

#### GET `http://drone.sumc.bg/api/v1/metro/all`
- Returns all metro stops
  - Contains coordinates

#### GET `http://drone.sumc.bg/api/v1/metro/times/STATIONID`
- Returns the timetable for the given station

#### GET `http://drone.sumc.bg/api/v1/config`
- Returns the server time and some other stuff
  - No seconds
