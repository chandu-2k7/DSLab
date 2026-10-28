# Experiment 4C - Combining DataFrames with combine_first()
# Source reference: DS-codes/Exp_4/exp4abc.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd
import numpy as np

df1 = pd.DataFrame({'a': [1, np.nan, 3], 'b': [4, 5, 6]})
df2 = pd.DataFrame({'a': [7, 8, 9], 'b': [np.nan, 11, 12]})

# Values from df1 win; gaps are filled from df2
merged = df1.combine_first(df2)
print(merged)
