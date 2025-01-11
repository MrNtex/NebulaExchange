import torch
from config import config
from Models.GRU import GRUModel
from Models.LSTM import LSTMModel
from Models.RNN import RNNModel

model_params = {
  'input_dim': 64,
  'hidden_dim': config.HIDDEN_DIM,
  'layer_dim': config.LAYER_DIM,
  'output_dim': config.OUTPUT_DIM,
  'dropout_prob': config.DROPOUT,
  'device': "cuda" if torch.cuda.is_available() else "cpu"
}

def get_model(model, input_dim):
    models = {
        "LSTM": LSTMModel,
        "GRU": GRUModel,
        "RNN": RNNModel,
    }

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    model_params = {
        'input_dim': input_dim,
        'hidden_dim': config.HIDDEN_DIM,
        'layer_dim': config.LAYER_DIM,
        'output_dim': config.OUTPUT_DIM,
        'dropout_prob': config.DROPOUT,
        'device': device
    }


    return models.get(model.upper())(**model_params).to(device)