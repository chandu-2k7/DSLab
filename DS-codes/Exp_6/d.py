import pandas as pd

p = pd.Period('2026-01', freq='M')

print("Original Period:")
print(p)

print("\nAfter adding 2:")
print(p + 2)

print("\nAfter adding 5:")
print(p + 5)

print("\nAfter subtracting 1:")
print(p - 1)

print("\nAfter subtracting 3:")
print(p - 3)

periods = pd.period_range(
    start='2026-01',
    periods=6,
    freq='M'
)

print("\nRange of Periods:")
print(periods)
