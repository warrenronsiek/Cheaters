import sys
import os

counter = 0
pwd = os.getcwd()

if not os.path.exists(os.path.join(pwd, sys.argv[2])):
    os.mkdir(os.path.join(pwd, sys.argv[2]))

with open(os.path.join(pwd, sys.argv[1]), 'rw') as sourceFile:

    writefile = open(os.path.join(pwd, sys.argv[2], "chunk" + str(counter) + sys.argv[1]), 'w+')
    for line in sourceFile:

        if counter % 10 == 0 and counter != 0:
            writefile.close()
            writefile = open(os.path.join(pwd, sys.argv[2], "chunk" + str(counter) + sys.argv[1]), 'w+')

        writefile.write(line)
        counter += 1

sourceFile.close()