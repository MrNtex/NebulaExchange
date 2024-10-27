

import numpy as np
import pandas as pd
import torch

from sklearn.preprocessing import MinMaxScaler
from torch.utils.data import TensorDataset, DataLoader

from torch import nn
import matplotlib.pyplot as plt
from tqdm import tqdm

CSV_FILE = 'data\\bitcoin\\btcusd_1-min_data.csv'

# Load your data
df = pd.read_csv(CSV_FILE)  # Replace with your CSV file

# Convert the timestamp to datetime
df['Timestamp'] = pd.to_datetime(df['Timestamp'], unit='s')

# Limit to hourly data
df.set_index('Timestamp', inplace=True)

df = df.resample('h').mean()

# Drop rows with any NaN values
df.dropna(inplace=True)
 
# Save the data
df.to_csv('data\\bitcoin\\btcusd_1-min_data_hourly.csv')

scaler = MinMaxScaler()
df['Close'] = scaler.fit_transform(df[['Close']])  # Scale the 'Close' column

df.to_csv('data\\bitcoin\\scaled_btcusd_1-min_data_hourly.csv')

print("PyTorch version: ", torch.__version__)

device = torch.device("cuda")

if (not torch.cuda.is_available()):
    print("CUDA is not available.  Training on CPU ...")
    device = torch.device("cpu")

### Prepare sequences for training ###
def create_sequences(data, seq_length):
    xs = []
    ys = []

    for i in tqdm(range(len(data) - seq_length - 1),desc='Creating sequences'):
        x = data[i:(i + seq_length)]
        y = data[i + seq_length]
        xs.append(x)
        ys.append(y)

    return np.array(xs), np.array(ys)

x, y = create_sequences(df['Close'].values, seq_length=50)

X = torch.tensor(x, dtype=torch.float32, device=device)
Y = torch.tensor(y, dtype=torch.float32, device=device)

dataset = TensorDataset(X, Y)
dataloader = DataLoader(dataset, batch_size=32, shuffle=True)


from Crypto_Price_Prediction import BitcoinLSTM



model = BitcoinLSTM().to(device)
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

epochs = 50

for epoch in range(epochs):
    for X_batch, Y_batch in tqdm(dataloader, desc=f'Epoch {epoch+1}/{epochs}'):
        
        outputs = model(X_batch.unsqueeze(-1))
        loss = criterion(outputs, Y_batch.unsqueeze(-1))
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    print(f'Epoch {epoch+1}/{epochs}, Loss: {loss.item()}')


model.eval()
predictions = []
input_seq = X[-1].unsqueeze(0).unsqueeze(-1).to(device)

print(input_seq.shape)

for _ in tqdm(range(200 * 24), desc='Predicting'):
    with torch.no_grad():
        prediction = model(input_seq)
        predictions.append(prediction.item())
        input_seq = torch.cat((input_seq[:, 1:, :], prediction.unsqueeze(0)), dim=1)

# Inverse transform the predictions
predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))

# Convert to DataFrame or plot as needed
predicted_df = pd.DataFrame(predictions, columns=['Predicted Close'])

# Save the predictions
predicted_df.to_csv('data\\bitcoin\\predicted_btcusd_1-min_data_hourly.csv')

plt.figure(figsize=(12, 6))
plt.plot(predicted_df['Predicted Close'], label='Predicted Prices', color='blue')  # Correctly reference the column name
plt.title('Predicted Bitcoin Prices')
plt.xlabel('Time Step')
plt.ylabel('Price (USD)')
plt.legend()
plt.show()