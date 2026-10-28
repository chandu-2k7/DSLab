import pandas as pd

date_index = pd.date_range(
    start='2026-01-01',
    periods=7,
    freq='D'
)

print("Generated DatetimeIndex:")
print(date_index)
