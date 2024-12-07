
using System.Text.Json.Serialization;

/// <summary>
/// Interface for Coin service to handle coin operations. Each nested list contains timestamp [0] and value [1].
/// </summary>
public class CoinChartRoot
{
    public List<List<decimal?>> Prices { get; set; } = new List<List<decimal?>>();
    [JsonPropertyName("market_caps")]
    public List<List<decimal?>> MarketCaps { get; set; } = new List<List<decimal?>>();
    [JsonPropertyName("total_volumes")]
    public List<List<decimal?>> TotalVolumes { get; set; } = new List<List<decimal?>>();
}

public class CoinChartMinMax
{
    public List<decimal> min { get; set; } = new List<decimal>();
    public List<decimal> max { get; set; } = new List<decimal>();

    public CoinChartMinMax(decimal minValueTimestamp, decimal minValue, decimal maxValueTimestamp, decimal maxValue)
    {
        this.min = new List<decimal> { minValueTimestamp, minValue };
        this.max = new List<decimal> { maxValueTimestamp, maxValue };
    }
}
/// <summary>
/// Coin chart data with min and max values.
/// </summary>
public class CoinChart : CoinChartRoot
{
    public CoinChartMinMax PricesMinMax { get; set; }
    public CoinChartMinMax MarketCapsMinMax { get; set; }
    public CoinChartMinMax TotalVolumesMinMax { get; set; }

    public CoinChart(CoinChartRoot root)
    {
        Prices = root.Prices;
        MarketCaps = root.MarketCaps;
        TotalVolumes = root.TotalVolumes;

        PricesMinMax = GetMinMax(Prices);
        MarketCapsMinMax = GetMinMax(MarketCaps);
        TotalVolumesMinMax = GetMinMax(TotalVolumes);
    }

    private CoinChartMinMax GetMinMax(List<List<decimal?>> list)
    {
        decimal? minValue = list[0][1];
        decimal? minValueTimestamp = list[0][0];
        decimal? maxValue = list[0][1];
        decimal? maxValueTimestamp = list[0][0];

        foreach (var item in list)
        {
            if (item != null && (item[1] < minValue || minValue == null))
            {
                minValueTimestamp = item[0];
                minValue = item[1];
            }
            if (item != null && (item[1] > maxValue  || minValue == null))
            {
                maxValueTimestamp = item[0];
                maxValue = item[1];
            }
        }

        return new CoinChartMinMax(minValueTimestamp ?? 0, minValue ?? 0, maxValueTimestamp ?? 0, maxValue ?? 0);
    }
}