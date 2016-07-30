# Sofia Transport
The aim of this project is to display schedules and ETAs of Sofia City Transport buses in a (hopefully) more meaningful way.

## How to run
- To start the app run:

```
npm install
./node_modules/bower/bin/bower install # I don't like installing globally with npm
npm download_db # Generates ./database/raw_database.js, might be buggy
npm start
```

## TODO
- Fix layout, write some css
- Use ES6 features
- Auto poll remaining time
- ~~Write scripts to obtain lines|routes|stops info from [soffiatraffic.bg]()~~
  - Fix lines with more than two routes
- ~~Keep list of favourite stops in `localStorage`~~
  - Make it possible to rename favourite stops
  - ~~Make it possible to delete favourite stops~~
    - Delete all option
- Support subway stops
- Add map for route visualization
  - Probably [openstreetmap](http://www.openstreetmap.org/)
    - Or another free alternative (free as in freedom)
  - Map shouldn't load by default
    - Not to be heavy on slow internet
  - Add some goodies on the map
