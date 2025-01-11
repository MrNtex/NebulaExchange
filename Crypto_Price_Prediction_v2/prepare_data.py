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

def prepare_data():

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

    return X, y, df
