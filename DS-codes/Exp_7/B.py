import pandas as pd
data = {
    'Department': ['CSE', 'CSE', 'CSE', 'ECE', 'ECE', 'ECE',
                   'EEE', 'EEE', 'EEE'],
    'Marks': [80, 75, 85, 70, 65, 75, 90, 85, 95],
    'Attendance': [90, 85, 95, 80, 75, 85, 95, 90, 100]
}

df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)
result = df.groupby('Department').aggregate({
    'Marks': ['sum', 'mean', 'std'],
    'Attendance': ['sum', 'mean', 'std']
})

print("\nSummary Statistics:")
print(result)

