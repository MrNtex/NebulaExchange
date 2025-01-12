export interface CoinPrediction {
  coinId: string;
  predictions: Prediction[];
}

export interface Prediction {
  timestamp: number;
  predicted_Open: number;
}