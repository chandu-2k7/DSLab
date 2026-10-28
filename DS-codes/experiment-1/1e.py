# Experiment 1E - Writing and reading Excel workbooks (single + multiple sheets)
# Source reference: DS-codes/FromLocal/FromExcel_Exp1C/*.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd

# ---- Part 1: write a single sheet to an Excel file ----
student_data = {
    "Roll_NO": [101, 102, 103, 104],
    "Name": ["Vishnu", "kanishka", "Shashank", "Kushvanth"],
    "Department": ["It", "cse", "csd", "ds"],
    "Marks": [92, 98, 95, 76]
}
df = pd.DataFrame(student_data)
df.to_excel("student.xlsx", sheet_name="student_Details", index=False)
print("Data successfully written is student.xlsx")

# ---- Part 2: write MULTIPLE sheets into one workbook ----
courses_data = {
    "course_id": ["c101", "c102", "c103"],
    "course_Name": ["python", "sql", "machine learning"],
    "credit": [9, 8, 9]
}
courses_df = pd.DataFrame(courses_data)

with pd.ExcelWriter("college_data.xlsx", engine="openpyxl") as writer:
    df.to_excel(writer, sheet_name="students", index=False)
    courses_df.to_excel(writer, sheet_name="courses", index=False)
print("Multiple sheets successfully written to college_data.xlsx")

# ---- Part 3: read every sheet back from the workbook ----
excel_data = pd.read_excel("college_data.xlsx", sheet_name=None)
print("Available sheets:")
print(list(excel_data.keys()))
print("\nStudent sheet:")
print(excel_data["students"])
print("\nCourses sheet:")
print(excel_data["courses"])
