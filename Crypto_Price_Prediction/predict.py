import os
import kagglehub
import pandas as pd
import numpy as np
from tqdm import tqdm

from sklearn.model_selection import train_test_split
#from sklearn.linear_model import LinearRegression
from sklearn.ensemble import GradientBoostingRegressor
# Download latest version

download_direactory = "data/bitcoin"

#os.makedirs(download_direactory, exist_ok=True)

#csv_file = kagglehub.dataset_download("mczielinski/bitcoin-historical-data")
csv_file = "data/bitcoin/btcusd_1-min_data.csv"
print(csv_file)
#####
#Timestamp,Open,High,Low,Close,Volume
#1325412060.0,4.58,4.58,4.58,4.58,0.0

def load_data(csv_file):
    df = pd.read_csv(csv_file)

    df['Timestamp'] = pd.to_datetime(df['Timestamp'], unit='s')
    df.set_index('Timestamp', inplace=True)

    return df


def prepare_data(df, n_days=200):
    # Shift the target variable to predict future prices
    df['Target_Close'] = df['Close'].shift(-n_days)

    # Create lag features using pd.concat to avoid DataFrame fragmentation
    lagged_data = pd.concat(
        [df['Close'].shift(i) for i in tqdm(range(1, n_days + 1), desc="Creating lag features")],
        axis=1
    )

    # Rename the lagged columns
    lagged_data.columns = [f'lag_{i}' for i in range(1, n_days + 1)]

    # Combine the original DataFrame with the lag features
    df = pd.concat([df, lagged_data], axis=1)

    # Drop rows with missing values (due to shift)
    df.dropna(inplace=True)

    # Define features and target
    features = df[[f'lag_{i}' for i in range(1, n_days + 1)]]
    target = df['Target_Close']

    return features, target, df

# Train the model
def train_model(features, target):
    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

    # Train the model
    model = GradientBoostingRegressor(n_estimators=100, random_state=42, verbose=2)
    model.fit(X_train, y_train)

    # Evaluate the model using R² score
    score = model.score(X_test, y_test)
    print(f'R² score: {score}')

    return model

# Predict future prices
def predict_future(model, df, n_days=200):
    # Get the last known data point for prediction
    last_known = df.iloc[-1][[f'lag_{i}' for i in range(1, n_days + 1)]].values.reshape(1, -1)

    future_predictions = []

    with tqdm(total=n_days, desc="Predicting future prices") as pbar:
        for _ in range(n_days):
            # Predict the next day's price
            next_pred = model.predict(last_known)[0]
            future_predictions.append(next_pred)

            # Shift the data for the next prediction
            last_known = np.roll(last_known, -1)
            last_known[0, -1] = next_pred  # Add the new prediction as the latest 'lag_1'

            pbar.update(1)

    return future_predictions

# Main flow
df = load_data(csv_file)

features, target, df = prepare_data(df, n_days=200)

model = train_model(features, target)

# Predict 200 days into the future
future_prices = predict_future(model, df, n_days=200)
print("Predicted prices successfully!")

# Save the future predictions to a CSV file
predictions_df = pd.DataFrame(future_prices, columns=['Predicted_Close'])
predictions_df.to_csv("data/bitcoin/future_predictions.csv", index=False)

print("Data saved successfully!")