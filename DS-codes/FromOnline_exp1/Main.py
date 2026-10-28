import pandas as pd

url="https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
df=pd.read_csv(url)
print("First Five rows in data")
print(df.head())
print("\nDataSet Information")
print(df.info())
print("\nNumber of Rows and colums :")
print(df.shape)