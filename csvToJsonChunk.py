import sys
import json
import csv

counter = 0
firstLine = ''
with open(sys.argv[1], 'rb') as csvFile:
    rowReader = csv.reader(csvFile, delimiter=',', quotechar='"')

    jsonFile = open(sys.argv[2] + str(counter) + '.json', 'w+')
    for row in rowReader:

        if counter % 20000 == 0 and counter != 0:
            jsonFile.close()
            jsonFile = open(sys.argv[2] + str(counter) + '.json', 'w+')
            sys.stdout.write('\r')
            sys.stdout.write(str(counter))
            sys.stdout.flush()

        if counter == 0:
            firstLine = list(map(lambda x: x.replace("'", ""), row))
            firstLineRecorded = True
        elif counter % 20000 > 1:
            jsonFile.write('\n')
            obj = dict(zip(firstLine, row))
            json.dump(obj, jsonFile)
        elif counter % 20000 == 1:
            obj = dict(zip(firstLine, row))
            json.dump(obj, jsonFile)
        counter += 1
    csvFile.close()
