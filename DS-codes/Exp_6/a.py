import pandas as pd
dates = pd.to_datetime([
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
    '2026-01-04',
    '2026-01-05'
])
temperature = [28, 30, 29, 31, 32]
time_series = pd.Series(
    temperature,
    index=dates
)
print("Time Series:")
print(time_series)
