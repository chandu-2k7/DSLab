# Experiment 1C - Reading and writing tab separated text files
# Source reference: DS-codes/FromLocal/FromTXT_Exp1.3/Main.py
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd
# getting data from txt file
df=pd.read_csv("FromLocal/FromTXT/student.txt",sep="\t")
print("Student Data:")
print(df)

# wring data in txt file
student_data={
    "Roll_num":[106,107,108,109,110],
    "Name":["King","Queen","Knight","Soldier","Thief"],
    "Department":["Core","Reproduction","BI","AArmy","Jail"],
    "Percentage":[78,77,69,67,55]
}
altdf=pd.DataFrame(student_data)
altdf.to_csv("FromLocal/FromTXT/student.txt",sep="\t",index=False)
print("Succesffully written data in student.txt file")
