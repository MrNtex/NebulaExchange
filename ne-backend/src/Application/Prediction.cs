public class Prediction
{
  public string CoinId { get; set; }
  public List<PredictionRecord> Predictions { get; set; } = new List<PredictionRecord>();

  public Prediction(string coinId, List<PredictionRecord> predictions)
  {
    CoinId = coinId;
    Predictions = predictions;
  }
}

public class PredictionRecord
{
    public long Timestamp { get; set; }
    public double PredictedOpen { get; set; } 
}