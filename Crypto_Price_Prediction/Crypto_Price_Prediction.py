import torch
import torch.nn as nn

class BitcoinLSTM(nn.Module):
    def __init__(self, input_size=1, hidden_layer_size=128, output_size=1, num_layers=3):
        super(BitcoinLSTM, self).__init__()
        self.hidden_layer_size = hidden_layer_size
        self.num_layers = num_layers
        
        # Define LSTM layer
        self.lstm = nn.LSTM(input_size, hidden_layer_size, num_layers, batch_first=True)
        
        # Define the output layer
        self.linear = nn.Linear(hidden_layer_size, output_size)

        self.dropout = nn.Dropout(0.2)

    def forward(self, input_seq):


        # Initialize hidden state and cell state
        h_0 = torch.zeros(self.num_layers, input_seq.size(0), self.hidden_layer_size).to(input_seq.device)
        c_0 = torch.zeros(self.num_layers, input_seq.size(0), self.hidden_layer_size).to(input_seq.device)
        
        # LSTM forward pass
        lstm_out, _ = self.lstm(input_seq, (h_0, c_0))
        
        # Get output from the last time step
        predictions = self.linear(lstm_out[:, -1, :])
        return predictions
