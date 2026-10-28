# Experiment 5A - Line plot with matplotlib
# Source reference: DS-codes/Exp_5/5abcde.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [10, 20, 25, 30]

plt.plot(x, y)
plt.title("line plot")
plt.xlabel("x-axis")
plt.ylabel("y-axis")
plt.grid(True)
plt.savefig("line_plot.png")
plt.show()
