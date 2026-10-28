# Experiment 2C - Persisting API responses into a SQLite database (sample)
# Source reference: sample implementation
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

# SAMPLE SUB-EXPERIMENT - replace with your own lab exercise if required.
import requests
import pandas as pd
import sqlite3

url = "https://api.github.com/repos/pandas-dev/pandas/issues"
issues = requests.get(url).json()

# Keep only a few useful columns then store them in an SQLite table
df = pd.DataFrame(issues)[['id', 'title', 'state', 'created_at']]

conn = sqlite3.connect("issues.db")
df.to_sql("issues", conn, if_exists="replace", index=False)

print("Rows stored:", len(df))
print(pd.read_sql_query("select state, count(*) as total from issues group by state", conn))
conn.close()
