# Experiment 1A - Reading a CSV dataset from a web URL
# Source reference: DS-codes/FromOnline_exp1/Main.py
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd

url="https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
df=pd.read_csv(url)
print("First Five rows in data")
print(df.head())
print("\nDataSet Information")
print(df.info())
print("\nNumber of Rows and colums :")
print(df.shape)
