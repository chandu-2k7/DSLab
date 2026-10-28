# Experiment 3B - Encoding and renaming categorical columns
# Source reference: DS-codes/Exp_3/exp3abcd.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd

df = pd.DataFrame({'gender': ['male', 'female', 'male']})

# Map text categories to numbers
df['gender_num'] = df['gender'].map({'male': 0, 'female': 1})

# Rename a column cleanly
df_renamed = df.rename(columns={'gender': 'Gender'})
print(df_renamed)
