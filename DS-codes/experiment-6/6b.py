# Experiment 6B - Time series (pandas)
# Source reference: DS-codes/Exp_6/b.py
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import pandas as pd

date_index = pd.date_range(
    start='2026-01-01',
    periods=7,
    freq='D'
)

print("Generated DatetimeIndex:")
print(date_index)
