from matplotlib import pyplot as plt
import pandas as pd
import numpy as np

from sklearn.discriminant_analysis import StandardScaler
from sklearn.preprocessing import MaxAbsScaler, MinMaxScaler, RobustScaler


from sklearn.model_selection import TimeSeriesSplit

import torch

from Crypto_Price_Prediction_v2.train import train
from Crypto_Price_Prediction_v2.Models.GRU import GRUModel
from Crypto_Price_Prediction_v2.Models.LSTM import LSTMModel
from Crypto_Price_Prediction_v2.Models.RNN import RNNModel

import Crypto_Price_Prediction_v2.config as config

df = pd.read_csv('data\\bitcoin\\btcusd_1-min_data.csv')

# Convert the timestamp to datetime
df['Timestamp'] = pd.to_datetime(df['Timestamp'], unit='s')

# Limit to hourly data
df.set_index('Timestamp', inplace=True)

df = df.resample('h').mean()

df.dropna(inplace=True)

df = df[['Close']]

def generate_time_lags(df, n_lags):
    df_n = df.copy()

    for n in range(1, n_lags + 1):
        df_n[f'Close_Lag_{n}'] = df_n['Close'].shift(n)

    df_n = df_n.iloc[n_lags:]
    return df_n

input_dim = 60
df_copy = df.copy()
df = generate_time_lags(df, input_dim)



df = (
    df
    .assign(hour = df.index.hour)
    .assign(day = df.index.day)
    .assign(day_of_week = df.index.dayofweek)
    .assign(month = df.index.month)
    )


def generate_cyclical_features(df, col_name, period, start_num=0):
    # Create sin and cos features based on the specified column
    df[f'sin_{col_name}'] = np.sin(2 * np.pi * (df[col_name] - start_num) / period)
    df[f'cos_{col_name}'] = np.cos(2 * np.pi * (df[col_name] - start_num) / period)
    # Drop the original column
    return df.drop(col_name, axis=1)

df = generate_cyclical_features(df, 'hour', 24, 0)
df = generate_cyclical_features(df, 'day', 31, 0)
df = generate_cyclical_features(df, 'day_of_week', 7, 0)
df = generate_cyclical_features(df, 'month', 12, 1)

index = df.index
df.reset_index(inplace=True)
X = df.loc[:, df.columns != "open"]
y = df.loc[:, df.columns == "open"]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def get_model(model, model_params):
    models = {
        "LSTM": LSTMModel,
        "GRU": GRUModel,
        "RNN": RNNModel,
    }

    return models.get(model.upper())(**model_params)

model_params = {
    'input_dim': len(X.columns),
    'hidden_dim': config.HIDDEN_DIM,
    'layer_dim': config.LAYER_DIM,
    'output_dim': config.OUTPUT_DIM,
    'dropout_prob': config.DROPOUT,
    'device': device
}

model = get_model("LSTM", model_params).to(device)

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

train_losses, validation_losses, oof, y_trues = train.train_function(X, y, scaler, device, model, model_params, tss)

def plot_losses(train_losses, validation_losses):
    plt.plot(train_losses, label="Training loss")
    plt.plot(validation_losses, label="Validation loss")
    plt.legend()
    plt.title("Losses")
    plt.show()
    plt.close()
    

def plot_oof(ground_truth, oof):
    plt.plot(ground_truth, label="Ground truth")
    plt.plot(oof, label="OOF")
    plt.legend()
    plt.title("Out of Fold vs. Ground truth")
    plt.show()
    plt.close()
    
    
def unstack(oof):
    preds = []
    for batch_prediction in oof:
        preds.append(batch_prediction.tolist())
    preds = [item for sublist in preds for item in sublist]
    preds = [item for sublist in preds for item in sublist]
    return preds


oof = unstack(oof)
y_trues = unstack(y_trues)

import plotly.express as px
import plotly.graph_objects as go

plot_df = pd.DataFrame([oof, y_trues]).T
plot_df.columns = ["oof","y_true"]
plot_df["date"] = index[0:4850]
plot_df = plot_df[0:4800]
plot_df.sort_values(by="date",inplace=True)

fig = go.Figure()

fig1 = fig.add_trace(
    go.Scatter(
        x = plot_df["date"],
        y = plot_df["oof"],
        name = "Predicted", # LINE LEGEND
        marker=dict(color="#eb9607"), # LINE COLOR
    )
)
fig2 = fig.add_trace(
    go.Scatter(
        x = plot_df["date"],
        y = plot_df["y_true"],
        name = "Actual", # LINE LEGEND
        marker=dict(color="#ecc257"), # LINE COLOR
    )
)

fig.update_layout(
    title_text="Predicted vs Actual Luna Price",
    template="plotly_dark",
    title_font_color="#cf7200", # TITLE FONT COLOR
    xaxis=dict(color="#cf7200"), # X AXIS COLOR
    yaxis=dict(color="#cf7200") # Y AXIS COLOR
)
fig.show()