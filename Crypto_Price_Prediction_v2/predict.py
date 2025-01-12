import numpy as np
import pandas as pd
import plotly.graph_objects as go
import torch

from scaler import get_scaler
import prepare_data
from model import get_model, model_params

# Prepare data
X, y, df = prepare_data.prepare_data()

# Initialize the model
model = get_model("LSTM", len(X.columns))

# Load the saved model weights
model.load_state_dict(torch.load('trained_model.pth', weights_only=True))


def predict_future_with_lags(model, scaler, last_known_data, future_steps, input_dim, device):
    model.eval()  # Set model to evaluation mode
    predictions = []
    
    # Ensure the scaler is fitted on the same columns used for training (e.g., X features)
    last_known_data_scaled = scaler.transform(last_known_data)  # Scale the input features (all columns)

    # Reshape the input to match the expected shape: [batch_size, seq_len, input_size]
    current_input = last_known_data_scaled[-input_dim:].reshape(1, input_dim, -1)  # Add batch dimension
    
    for step in range(future_steps):
        # Convert the current input into a tensor
        current_input_tensor = torch.tensor(current_input, dtype=torch.float32).to(device)  # Add batch dimension
        
        with torch.no_grad():  # Disable gradient calculation during inference
            # Pass through the model
            predicted = model(current_input_tensor)
        
        # Append the predicted value to the list of predictions
        predictions.append(predicted.item())
        
        # Update the input data by appending the predicted value (shift lags)
        current_input = np.roll(current_input, -1, axis=1)  # Shift array to the left (sequence dimension)
        current_input[0, -1, 0] = predicted.item()  # Insert the predicted value into the first feature position

    return predictions


# Initialize scaler
scaler = get_scaler("minmax")
scaler.fit(X)

input_dim = 60  # Number of previous time steps to use as input
future_steps = 31  # Number of steps to predict into the future

# Get the last known data point (the most recent data)
last_known_data = X.iloc[-input_dim:].values

print(f"Last known data: {last_known_data}")
print(f"Last known data shape: {last_known_data.shape}")

# Get the predictions for the next `future_steps` days
predictions = predict_future_with_lags(model, scaler, last_known_data, future_steps, input_dim, model_params['device'])

# Reshape predictions to match the scaler's expected input shape
# Add placeholder columns (e.g., zeros) to match the scaler's expected number of features (64 in this case)
predictions_reshaped = np.array(predictions).reshape(-1, 1)
predictions_with_zeros = np.hstack([predictions_reshaped, np.zeros((predictions_reshaped.shape[0], X.shape[1] - 1))])

# Inverse transform the predictions to return to the original scale
predictions_inv = scaler.inverse_transform(predictions_with_zeros)[:, 0]  # Only keep the "Open" column

# Now predictions_inv will contain the inverse-transformed predicted values

# Get the last timestamp from your data
last_timestamp = pd.to_datetime(df.index[-1])

print(f"Last timestamp: {df[-5:]} {last_timestamp}")

# Generate future dates based on the last known timestamp
future_dates = pd.date_range(last_timestamp + pd.Timedelta(days=1), periods=future_steps, freq='D')

# Create a DataFrame for future predictions
future_df = pd.DataFrame({"Timestamp": future_dates, "Predicted_Open": predictions_inv})

# Save the future predictions to a CSV file
future_df.to_csv("future_predictions.csv", index=False)
print(f"Future predictions saved to 'future_predictions.csv'")

# Plotting the future predictions
fig = go.Figure()


# Plot predicted data
fig.add_trace(
    go.Scatter(
        x = future_df["Timestamp"],
        y = future_df["Predicted_Open"],
        name = "Predicted Open",  # Line legend
        marker=dict(color="#1f77b4"),  # Line color
    )
)

# Layout for the plot
fig.update_layout(
    title_text="Predicted Bitcoin Open Price",
    template="plotly_dark",
    title_font_color="#cf7200",  # Title font color
    xaxis=dict(color="#cf7200"),  # X-axis color
    yaxis=dict(color="#cf7200")  # Y-axis color
)

