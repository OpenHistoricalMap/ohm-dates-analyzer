# ohm-dates-analyzer

Script to evaluate wrong dates (start_date and end_date) for nodes, ways, and relations using Planet PBF files, and the outputs will be CSV files

Get data from: 
https://planet.openhistoricalmap.org/?prefix=planet/


## Run the script

```sh
cd ohm-dates-analyzer
docker-compose build
docker-compose run ohm-da bash
# run the comnads under continaer 
node index.js data/planet-240417_0002.osm.pbf  relation.csv relation
node index.js data/planet-240417_0002.osm.pbf  way.csv way
node index.js data/planet-240417_0002.osm.pbf  node.csv node
```