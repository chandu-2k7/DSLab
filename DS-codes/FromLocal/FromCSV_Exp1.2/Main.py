import pandas as pd

url="https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
df=pd.read_csv(url)
# GETTING DATA FROM URL CSV FILE
print(df.head())


# WRITE IN STUDENT.CSV FILE
#Storing all rows in csv file which named studentCSV.csv
df.to_csv("FromLocal/FromCSV/studentCSV.csv",index=False)
print("Dataset of all rows successfully written to studentCSV.csv")


# WRIT IN 5CSVFILE
# storing first five rows in csv file which named student5csv.csv
temp=df.head()
temp.to_csv("FromLocal/FromCSV/student5csv.csv",index=False)
print("Dataset of 5 rows successfully written to student5csv.csv")

# get Data from local files
url2="FromLocal/FromCSV/student5csvLocal.csv"
df2=pd.read_csv(url2)
print(df2.head())