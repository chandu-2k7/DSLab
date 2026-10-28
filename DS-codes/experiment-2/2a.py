# Experiment 2A - Fetching REST API data with the requests library
# Source reference: DS-codes/Exp_2/Exp2a.ipynb
# NOTE: This mapped copy is used by the Lab website's code editor.
# The original student file in DS-codes/ is preserved and never modified.

import requests
import pandas as pd

# Public GitHub REST API endpoint (no API key required for read access)
url = "https://api.github.com/repos/pandas-dev/pandas/issues"
response = requests.get(url)
issues = response.json()

# Load the JSON list of issues straight into a DataFrame
df_issues = pd.DataFrame(issues)

print(df_issues[['id', 'title', 'state', 'created_at']].head())
