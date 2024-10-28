import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

actual = pd.read_csv("C:\\Users\\ntexy\\Documents\\NebulaExchange\\data\\bitcoin\\btcusd_1-min_data_hourly.csv")
predicted = pd.read_csv("C:\\Users\\ntexy\\Documents\\NebulaExchange\\data\\bitcoin\\results.csv")

plot_df = pd.DataFrame({
    "Predicted": predicted["Close"],
    "Actual": actual["Close"]
})

fig = go.Figure()
fig.add_trace(go.Scatter(x=plot_df.index, y=plot_df["Actual"], mode='lines', name='Actual'))
fig.add_trace(go.Scatter(x=plot_df.index, y=plot_df["Predicted"], mode='lines', name='Predicted'))

fig.update_layout(title='Actual vs Predicted Bitcoin Prices',
                  xaxis_title='Time',
                  yaxis_title='Price (USD)')

fig.show()
