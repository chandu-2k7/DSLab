# Experiment 3C - Detecting outliers with boolean masks
# Source reference: DS-codes/Exp_3/exp3abcd.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import numpy as np
import pandas as pd

# 100 rows x 3 columns of standard normal random data
data = pd.DataFrame(np.random.randn(100, 3))

# Flag values more than 3 standard deviations from the mean
outliers = (data > 3) | (data < -3)
print(outliers.sum())
