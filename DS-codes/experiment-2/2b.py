# Experiment 2B - SQLite database CRUD operations with pandas
# Source reference: DS-codes/Exp_2/Exp2b.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import sqlite3
import pandas as pd

# ---- connect and create a table ----
conn = sqlite3.connect("student.db")
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT)")
print("Table students created")

# ---- CREATE ----
cursor.execute("INSERT INTO students VALUES (1, 'kani')")
conn.commit()
print("Inserted successfully")

# ---- READ ----
df = pd.read_sql_query("select * from students", conn)
print(df)

# ---- UPDATE ----
cursor.execute("UPDATE students SET name = 'kanishka' where id = 1")
conn.commit()
df = pd.read_sql_query("select * from students", conn)
print("Updated")
print("\n", df)

# ---- DELETE ----
cursor.execute("DELETE from students where id = 1")
conn.commit()
df = pd.read_sql_query("select * from students", conn)
print("After deleted")
print("\n", df)

conn.close()
