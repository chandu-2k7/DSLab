# Experiment 1D - Writing and reading JSON data with pandas
# Source reference: DS-codes/FromLocal/FromJSON_Exp1B.1/*.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd
from io import StringIO

# ---- Part 1: write a DataFrame to a JSON file (records orientation) ----
student_data = {
    "Roll_no": [101, 102, 103, 104],
    "Name": ["Mammooty", "DQ", "Tovino", "Basil"],
    "Department": ["Thriller", "Drama", "Sci-Fi", "Comedy"],
    "Ratings": [4, 5, 5, 4]
}

df = pd.DataFrame(student_data)
df.to_json("student.json", orient="records", indent=4)
print("Successfully written in 'student.json'")

# ---- Part 2: parse JSON held in a string back into a DataFrame ----
json_data = """
[
    {"Roll_no": 1, "Name": "Raju",  "Marks": 99},
    {"Roll_no": 2, "Name": "Ravi",  "Marks": 98},
    {"Roll_no": 3, "Name": "Ramu",  "Marks": 97}
]
"""

df2 = pd.read_json(StringIO(json_data))
print("Parsed data\n")
print(df2)
