# Experiment 5C - Histogram with a density curve
# Source reference: DS-codes/Exp_5/5abcde.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt

data = np.random.randn(1000)
sns.histplot(data, kde=True)
plt.title("Histogram & Density")
plt.show()
