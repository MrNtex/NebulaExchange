import datetime
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
import time
import torch
import torch.nn as nn


from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MaxAbsScaler, MinMaxScaler, RobustScaler, StandardScaler
from torch.optim.lr_scheduler import ReduceLROnPlateau
from torch.utils.data import TensorDataset, DataLoader
from tqdm import tqdm

from model import get_model, model_params
from train import train
from Models.GRU import GRUModel
from Models.LSTM import LSTMModel
from Models.RNN import RNNModel

from config import config

import kagglehub

# Download latest version
path = kagglehub.dataset_download("mczielinski/bitcoin-historical-data")

print("Path to dataset files:", path)

# List files in the directory to find the dataset file
files = os.listdir(path)
print("Files in dataset directory:", files)

# Assuming the dataset has a file named "bitcoin.csv" or similar
# Replace "bitcoin.csv" with the actual file name
file_name = "btcusd_1-min_data.csv"  # Update this based on the actual file in the directory
file_path = os.path.join(path, file_name)

# Load the dataset
df = pd.read_csv(file_path, sep=',')
print(df.head())



df = df[["Open", "Timestamp"]]
df.set_index("Timestamp", inplace=True)
df.index = pd.to_datetime(df.index, unit='s')
print(f"Dataframe shape: {df.shape}")
print(df.head())# Set 'Timestamp' as index

# Resample to daily data
df_daily = df['Open'].resample('D').mean().dropna()
df = df_daily.to_frame(name="Open")
print(f"Dataframe shape (daily): {df.shape}")
print(df.head())

def generate_time_lags(df, n_lags):
    df_n = df.copy()
    for n in range(1, n_lags + 1):
        df_n[f"lag{n}"] = df_n["Open"].shift(n)

    df_n = df_n.dropna()
    return df_n
    
input_dim = 60


df = generate_time_lags(df, input_dim)

# Adding day, day_of_week, and month columns
df = (
    df
    .assign(day=df.index.day)
    .assign(day_of_week=df.index.dayofweek)
    .assign(month=df.index.month)
)

def generate_cyclical_features(df, col_name, period, start_num=0):
    # Create sin and cos features based on the specified column
    df[f'sin_{col_name}'] = np.sin(2 * np.pi * (df[col_name] - start_num) / period)
    df[f'cos_{col_name}'] = np.cos(2 * np.pi * (df[col_name] - start_num) / period)
    # Drop the original column
    return df.drop(col_name, axis=1)

#df = generate_cyclical_features(df, 'hour', 24, 0)
df = (
    df
    .assign(minute = df.index.minute)
    .assign(hour = df.index.hour)
    .assign(day = df.index.day)
    .assign(month = df.index.month)
    .assign(day_of_week = df.index.dayofweek)
    )
df.drop(columns=["month"], inplace=True)

index = df.index
df.reset_index(drop=True, inplace=True)
X = df.loc[:, df.columns != "Open"]
y = df.loc[:, df.columns == "Open"]

model = get_model("LSTM", len(X.columns))


def get_scaler(scaler):
    scalers = {
        "minmax": MinMaxScaler(),
        "standard": StandardScaler,
        "maxabs": MaxAbsScaler,
        "robust": RobustScaler,
    }
    return scalers.get(scaler.lower())

scaler = get_scaler("minmax")

### 
### Time Series Split
# In a time series split you want to make sure that none of the information about the future is fed into your model
#  to give it observations about something it shouldn't have seen at that moment in time. 
# It also is known as a sliding window approach where you grow the amount of training data that you're providing it in time 
# and then testing on the amount of time right after the training period ends.

tss = TimeSeriesSplit(n_splits=config.FOLDS, max_train_size=None, test_size=None, gap=0)


# Train

print("Training on GPU" if torch.cuda.is_available() else "Training on CPU")

train_losses, validation_losses, oof, y_trues = train.train_function(X, y, scaler, model_params['device'], model, model_params, tss)

def plot_losses(train_losses, validation_losses):
    plt.plot(train_losses, label="Training loss")
    plt.plot(validation_losses, label="Validation loss")
    plt.legend()
    plt.title("Losses")
    plt.show()
    

def plot_oof(ground_truth, oof):
    plt.plot(ground_truth, label="Ground truth")
    plt.plot(oof, label="OOF")
    plt.legend()
    plt.title("Out of Fold vs. Ground truth")
    plt.show()
    
    
def unstack(oof):
    preds = []
    for batch_prediction in oof:
        preds.append(batch_prediction.tolist())
    preds = [item for sublist in preds for item in sublist]
    preds = [item for sublist in preds for item in sublist]
    return preds


oof = unstack(oof)
y_trues = unstack(y_trues)

# Save the model's state_dict (weights)
torch.save(model.state_dict(), 'trained_model.pth')
print("Model saved as 'trained_model.pth'")
