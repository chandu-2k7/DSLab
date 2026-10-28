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