# Sofia Transport
The aim of this project is to display schedules and ETAs of Sofia City Transport buses in a (hopefully) more meaningful way.
Goals:
- To work
- To be useful
- No captchas
- Not to load unneeded heavy stuff (like photos of the subway or people with bikes)

## How to run
- To start the app run:

```
npm install
npm start
```

## TODO
- Fix layout, write some css (this is always going to be here)
- Auto poll remaining time
- ~~Keep list of favourite stops in `localStorage`~~
  - ~~Make it possible to rename favourite stops~~
  - ~~Make it possible to delete favourite stops~~
    - Delete all option
- Support subway stops
- Add map for route visualization
  - Probably [openstreetmap](http://www.openstreetmap.org/)
  - Map shouldn't load by default
    - Not to be heavy on slow internet
  - Add some goodies on the map
