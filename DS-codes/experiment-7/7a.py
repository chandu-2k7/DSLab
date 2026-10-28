# Experiment 7a - GroupBy and aggregation
# Source reference: DS-codes/Exp_7/A.py
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd
data = {
    'Name': ['Ravi', 'Sita', 'Arun', 'Priya', 'Kiran', 'Anil', 'Lakshmi', 'Rahul'],
    'Department': ['CSE', 'CSE', 'ECE', 'ECE', 'CSE', 'ECE', 'CSE', 'ECE'],
    'Year': [2, 2, 3, 3, 2, 3, 3, 2],
    'Marks': [85, 90, 78, 88, 75, 82, 95, 70]
}
df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)

print("\n1. Group by Department:")

group1 = df.groupby('Department')

for name, group in group1:
    print("\nDepartment:", name)
    print(group)
print("\nAverage Marks by Department:")
print(df.groupby('Department')['Marks'].mean())

print("\n2. Group by Department and Year:")

group2 = df.groupby(['Department', 'Year'])

for name, group in group2:
    print("\nGroup:", name)
    print(group)

print("\nAverage Marks by Department and Year:")
print(df.groupby(['Department', 'Year'])['Marks'].mean())
