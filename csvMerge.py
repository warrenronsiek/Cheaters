import pandas as pd
import sys
import os
import re

cwd = os.getcwd()
dirstring = os.path.join(cwd, sys.argv[1])

files = os.listdir(dirstring)
files = [x for x in files if re.match('.*\.csv$', x)]
dfs = []

for f in files:
    try:
        dfs.append(pd.read_csv(os.path.join(dirstring, f)))
    except:
        pass

cc = pd.concat(dfs, ignore_index=False)

cc.to_csv(os.path.join(cwd, sys.argv[2] + '.csv'), index=False)
cc.to_json(os.path.join(cwd, sys.argv[2] + '.json'), orient='records')
