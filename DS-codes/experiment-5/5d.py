# Experiment 5D - Scatter plot of two random variables
# Source reference: DS-codes/Exp_5/5abcde.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import numpy as np
import matplotlib.pyplot as plt

x = np.random.rand(50)
y = np.random.rand(50)

plt.scatter(x, y)
plt.title("Scatter plot")
plt.xlabel("x")
plt.ylabel("y")
plt.show()
