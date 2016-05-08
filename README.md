# Sofia Transport
The aim of this project is to display schedules and ETAs of Sofia City Transport buses in a (hopefully) more meaningful way.

## How to run
- To start the app run:

```
npm install
./node_modules/bower/bin/bower install # I don't like installing globally with npm
node server.js
```

- To obtain the database
  - Get the `/data/data/com.sofiatraffic.android` folder from android device with the app
  - Use the `database/extract.sh` script
  - _The app currently holds buggy database_

## TODO
- Fix layout, write some css
- Write scripts to obtain lines|routes|stops info from [soffiatraffic.bg]()
  - It is not that buggy
  - Have to parse some html, meh
- Keep list of favourite stops in `localStorage`
- Add map for route visualization
  - Probably [openstreetmap](http://www.openstreetmap.org/)
    - Or another free alternative (free as in freedom)
  - Map shouldn't load by default
    - Not to be heavy on slow internet
  - Add some goodies on the map
