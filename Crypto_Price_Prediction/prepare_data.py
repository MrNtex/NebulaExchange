

import numpy as np
import pandas as pd

CSV_FILE = 'data\\bitcoin\\btcusd_1-min_data.csv'

# Load your data
df = pd.read_csv(CSV_FILE)  # Replace with your CSV file

# Convert the timestamp to datetime
df['Timestamp'] = pd.to_datetime(df['Timestamp'], unit='s')

# Limit to hourly data
df.set_index('Timestamp', inplace=True)

df = df.resample('h').mean()
 
# Save the data
df.to_csv('data\\bitcoin\\btcusd_1-min_data_hourly.csv')

