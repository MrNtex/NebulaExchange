public class Coin
{
  public string id { get; set; } = string.Empty;
  public string symbol	 { get; set; } = string.Empty;
  public string name { get; set; } = string.Empty;
  public string image { get; set; } = string.Empty;
  public double? market_cap { get; set; }
  public double? total_volume { get; set; }
  public double? price_change_percentage_24h { get; set; }
  public double? current_price { get; set; }
}

public class Market
{
    public string? Name { get; set; }
    public string? Identifier { get; set; }
    public string? TradingPair { get; set; }
}

public class ConvertedLast
{
    public decimal? Btc { get; set; }
    public decimal? Eth { get; set; }
    public decimal? Usd { get; set; }
}

public class ConvertedVolume
{
    public decimal? Btc { get; set; }
    public decimal? Eth { get; set; }
    public decimal? Usd { get; set; }
}

public class Ticker
{
    public string? Base { get; set; }
    public string? Target { get; set; }
    public Market? Market { get; set; }
    public decimal? Last { get; set; }
    public decimal? Volume { get; set; }
    public ConvertedLast? ConvertedLast { get; set; }
    public ConvertedVolume? ConvertedVolume { get; set; }
    public string? TrustScore { get; set; }
    public decimal? BidAskSpreadPercentage { get; set; }
    public DateTime? Timestamp { get; set; }
    public DateTime? LastTradedAt { get; set; }
    public DateTime? LastFetchAt { get; set; }
    public bool? IsAnomaly { get; set; }
    public bool? IsStale { get; set; }
    public string? TradeUrl { get; set; }
    public string? TokenInfoUrl { get; set; }
    public string? CoinId { get; set; }
    public string? TargetCoinId { get; set; }
}
public class CoinAdvanced : Coin
{
  public double? high_24h { get; set; }
  public double? low_24h { get; set; }

  public double? ath { get; set; }
  public string? description { get; set; }
  public string? homepage { get; set; }
  public string? whitepaper { get; set; }

  public string? reddit { get; set; }
  public string? twitter { get; set; }
  public string? facebook { get; set; }

  public string? github { get; set; }

  public List<Ticker> tickers { get; set; } = new List<Ticker>();
}