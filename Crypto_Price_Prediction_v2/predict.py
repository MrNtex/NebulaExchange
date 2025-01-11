import plotly.express as px
import plotly.graph_objects as go
import torch

# Initialize the model
model = get_model("RNN", len(X.columns))

# Load the saved model weights
model.load_state_dict(torch.load('trained_model.pth'))
# Align lengths
min_length = min(len(oof), len(y_trues), len(index))
oof = oof[:min_length]
y_trues = y_trues[:min_length]
aligned_index = index[:min_length]

# Create DataFrame
plot_df = pd.DataFrame({"oof": oof, "y_true": y_trues, "Timestamp": aligned_index})

output_path = "predicted_vs_actual.csv"  # Specify the file name or path
plot_df.to_csv(output_path, index=False)  # Save without the index

print(f"File saved as {output_path}")
print(f"Input dimensions: {input_dim}")

def predict_future(model, scaler, last_known_data, future_steps, input_dim, device):
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
        
        # Update the input data by appending the predicted value (keep dimensions intact)
        current_input = np.roll(current_input, -1, axis=1)  # Shift array to the left (sequence dimension)
        current_input[0, -1, 0] = predicted.item()  # Insert the predicted value into the first feature position

    return predictions

scaler.fit(X)
# Get the last known data point
last_known_data = X.iloc[-input_dim:].values

print(f"Last know data: {last_known_data}")

print(f"Last known data shape: {last_known_data.shape}")

# Number of steps to predict into the future
future_steps = 10

# Get the predictions for the next `future_steps` days
predictions = predict_future(model, scaler, last_known_data, future_steps, input_dim, device)

last_timestamp = pd.to_datetime(df.index[-1])
# Convert predictions into a DataFrame with the corresponding timestamps
future_dates = pd.date_range(last_timestamp + pd.Timedelta(days=1), periods=future_steps, freq='D')
future_df = pd.DataFrame({"Timestamp": future_dates, "Predicted_Open": predictions})

# Save the future predictions to a CSV file
future_df.to_csv("future_predictions.csv", index=False)
print(f"Future predictions saved to 'future_predictions.csv'")

# Plotting the future predictions along with the actual data
fig = go.Figure()

# Plot actual data
fig.add_trace(
    go.Scatter(
        x = df.index,
        y = df['Open'],
        name = "Actual Open",  # Line legend
        marker=dict(color="#ff7f0e"),  # Line color
    )
)

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
    title_text="Actual vs Predicted Bitcoin Open Price",
    template="plotly_dark",
    title_font_color="#cf7200",  # Title font color
    xaxis=dict(color="#cf7200"),  # X-axis color
    yaxis=dict(color="#cf7200")  # Y-axis color
)

# Save the plot to a file
fig.write_html("predicted_vs_actual_chart.html")
print("Chart saved as 'predicted_vs_actual_chart.html'")

# Display the plot
fig.show()