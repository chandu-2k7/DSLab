# Experiment 5B - Bar plot from a DataFrame
# Source reference: DS-codes/Exp_5/5abcde.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({'category': ['A', 'B', 'C'], 'values': [10, 20, 15]})
df.plot(kind='bar', x='category', y='values')
plt.title("BarPlot")
plt.show()
