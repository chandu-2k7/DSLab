# Experiment 3D - Cleaning text with regular expressions
# Source reference: DS-codes/Exp_3/exp3abcd.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import re

text = "This is\t a\n test"

# Split on any run of whitespace (spaces, tabs, newlines)
split_text = re.split(r'\s+', text)
print(split_text)
