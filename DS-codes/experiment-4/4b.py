# Experiment 4B - Reshaping with unstack() and stack()
# Source reference: DS-codes/Exp_4/exp4abc.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd
import numpy as np

data = pd.Series(
    np.random.randn(6),
    index=[['a', 'a', 'b', 'b', 'c', 'c'], [1, 2, 1, 2, 1, 2]]
)

df = data.unstack()
print(df)
print(df.stack())
