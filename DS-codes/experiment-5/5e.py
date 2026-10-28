# Experiment 5E - Box plot for distribution summary
# Source reference: DS-codes/Exp_5/5abcde.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt

sns.boxplot(data=np.random.randn(10014))
plt.title("Box plot")
plt.show()
