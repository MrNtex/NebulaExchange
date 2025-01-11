import datetime
import time
from sklearn.model_selection import TimeSeriesSplit
import torch
import numpy as np
from torch import nn
from torch.optim.lr_scheduler import ReduceLROnPlateau
from torch.utils.data import TensorDataset, DataLoader

from tqdm import tqdm

from scaler import get_scaler
from model import get_model, model_params
from config import config

class train:
    def __init__(self):
        pass

    def train_model(X, y):
        
        model = get_model("LSTM", len(X.columns))


        

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

    
    def train_function(X, y, scaler, device, model, model_params, tss):

        # Out of Fold Predictions
        oof = []
        y_trues = []

        train_losses = []
        validation_losses = []

        for train_index, valid_index in tqdm(tss.split(X), desc='Training model'):
            # Initialize the model
            model = model

            # Create optimizer
            optimizer = torch.optim.Adam(model.parameters(), lr=config.LEARNING_RATE, weight_decay=config.WEIGHT_DECAY)

            # Create scheduler
            scheduler = ReduceLROnPlateau(optimizer, mode='max', patience=config.LR_PATIENCE, verbose=False, factor=config.LR_FACTOR)

            # Create loss function
            criterion = nn.MSELoss(reduction='mean')

            print('Train size:', len(train_index), "test_size:", len(valid_index)), print("\n")

            X_train, X_valid = X.iloc[train_index], X.iloc[valid_index]
            y_train, y_valid = y.iloc[train_index], y.iloc[valid_index]

            # Scale the data
            X_train = scaler.fit_transform(X_train)
            X_valid = scaler.transform(X_valid)
            y_train = scaler.fit_transform(y_train)
            y_valid = scaler.transform(y_valid)

            X_train = torch.tensor(X_train, dtype=torch.float32, device=device)
            X_valid = torch.tensor(X_valid, dtype=torch.float32, device=device)
            y_train = torch.tensor(y_train, dtype=torch.float32, device=device)
            y_valid = torch.tensor(y_valid, dtype=torch.float32, device=device)

            train = TensorDataset(X_train, y_train)
            val = TensorDataset(X_valid, y_valid)

            train_loader = DataLoader(train, batch_size=config.BATCH_SIZE_TRAIN, shuffle=False, drop_last=True)
            val_loader = DataLoader(val, batch_size=config.BATCH_SIZE_VALIDATION, shuffle=False, drop_last=True)

            for epoch in tqdm(range(config.EPOCHS), desc='Epochs'):
                batch_train_losses = []
                batch_val_losses = []
                start_time = time.time()

                # Set model to train mode
                model.train()

                for x_train_batch, y_train_batch in train_loader:
                    x_train_batch = x_train_batch.view([config.BATCH_SIZE_TRAIN, -1, model_params['input_dim']]).to(device)
                    y_true = y_train_batch.to(device)

                    # Clear gradients
                    optimizer.zero_grad()
                    # Log probability & propagation
                    y_pred = model(x_train_batch)
                    loss = criterion(y_true, y_pred)
                    loss.backward()
                    optimizer.step()
                    batch_train_losses.append(loss.item())

                training_loss = np.mean(batch_train_losses)
                train_losses.append(training_loss)

                # EVAL
                model.eval()
                # disable gradient calculation (need to be sure no optimization happens)
                with torch.no_grad():
                    for x_val, y_val in val_loader:
                        x_val = x_val.view([config.BATCH_SIZE_VALIDATION, -1, model_params['input_dim']]).to(device)
                        y_true = y_val.to(device)

                        y_pred = model(x_val)
                        val_loss = criterion(y_true, y_pred).item()
                        batch_val_losses.append(val_loss)

                    validation_loss = np.mean(batch_val_losses)
                    validation_losses.append(validation_loss)

                duration = str(datetime.timedelta(seconds=time.time() - start_time))[:7]

                if epoch < 10 or epoch % 10 == 0:
                    print(f'Epoch {epoch} took {duration} seconds. Training loss: {training_loss}, Validation loss: {validation_loss}')

                # Update the scheduler (for learning rate)
                scheduler.step(validation_loss)

                # Out of fold predictions
            model.eval()
            with torch.no_grad():
                for x_val, y_val in val_loader:
                    x_val = x_val.view([config.BATCH_SIZE_VALIDATION, -1, model_params["input_dim"]]).to(device)
                    y_true = y_val.to(device)
                    y_pred = model(x_val)
                    oof.append(scaler.inverse_transform(y_pred.cpu().numpy()))
            y_trues.append(scaler.inverse_transform(y_valid.cpu().numpy()))

        return train_losses, validation_losses, oof, y_trues