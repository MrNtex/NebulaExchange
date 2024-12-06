
using System.Text.Json.Serialization;

/// <summary>
/// Interface for Coin service to handle coin operations. Each nested list contains timestamp [0] and value [1].
/// </summary>
public class CoinChart
{
    public List<List<decimal>> Prices { get; set; } = new List<List<decimal>>();
    [JsonPropertyName("market_caps")]
    public List<List<decimal>> MarketCaps { get; set; } = new List<List<decimal>>();
    [JsonPropertyName("total_volumes")]
    public List<List<decimal>> TotalVolumes { get; set; } = new List<List<decimal>>();
}