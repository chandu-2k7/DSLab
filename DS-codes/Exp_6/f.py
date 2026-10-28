import pandas as pd


dates = pd.to_datetime([
    '2026-01-10',
    '2026-02-15',
    '2026-03-20',
    '2026-04-25'
])

sales = pd.Series(
    [1000, 1500, 1800, 2200],
    index=dates
)

print("Original Series:")
print(sales)



period_series = sales.to_period('M')

print("\nSeries converted to Monthly Periods:")
print(period_series)



df = pd.DataFrame(
    {
        'Sales': [1000, 1500, 1800, 2200],
        'Profit': [200, 300, 400, 500]
    },
    index=dates
)

print("\nOriginal DataFrame:")
print(df)


period_df = df.to_period('M')

print("\nDataFrame converted to Monthly Periods:")
print(period_df)

