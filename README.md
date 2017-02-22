Cheating
========

These are the miscellaneous scripts I used to process the AM data.

1. mysqldump\_to\_csv.py [is from jamesmishra](https://github.com/jamesmishra/mysqldump-to-csv). This turns the mysql dumps into csv.
2. cities15000.csv is data of all cities with greater than 15000 pop. I got it from [geonames.org](http://download.geonames.org/export/dump/)
3. csvToJson/csvToJsonChunk turn the csv from (1) and (2) into formats that can be processed by spark.
4. cheating.sc is a scala worksheet that uses spark to process the json from (2) and (3) into kmeansCollected.
5. csvMerge.py collects the output of cheating.sc into one csv
6. cheaters.js is a React component that renders the image.
7. topo_world.json is a topojson of the world that excludes Antartica.
