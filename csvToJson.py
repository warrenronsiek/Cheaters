import sys
import json
import csv

counter = 0
firstLine = ''
with open(sys.argv[2], 'w') as jsonFile:
    with open(sys.argv[1], 'rb') as csvFile:
        rowReader = csv.reader(csvFile, delimiter='\t', quotechar='"')
        for row in rowReader:
            if counter > 1:
                jsonFile.write('\n')
                obj = dict(zip(firstLine, row))
                json.dump(obj, jsonFile)
            if counter == 1:
                obj = dict(zip(firstLine, row))
                json.dump(obj, jsonFile)
            else:
                firstLine = list(map(lambda x: x.replace("'", ""), row))
            counter += 1
        csvFile.close()
    jsonFile.close()
