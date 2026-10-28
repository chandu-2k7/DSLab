# Experiment 3A - Detecting and handling missing values
# Source reference: DS-codes/Exp_3/exp3abcd.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd
import numpy as np

data = {'A': [1, 2, np.nan], 'B': [4, np.nan, np.nan]}
df = pd.DataFrame(data)

print(df.isna())

df_clean = df.dropna()
df_filled = df.fillna(0)

print(df_clean)
print(df_filled)
