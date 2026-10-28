# Experiment 4A - Building a hierarchical (MultiIndex) Series
# Source reference: DS-codes/Exp_4/exp4abc.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd
import numpy as np

# Two level index: outer letter and inner number
data = pd.Series(
    np.random.randn(6),
    index=[['a', 'a', 'b', 'b', 'c', 'c'], [1, 2, 1, 2, 1, 2]]
)

print(data)
print(data['b'])        # select the 'b' group
print(data[:, 1])       # select inner level == 1
