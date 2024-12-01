using System.Text.Json.Serialization;

public class Coin
{
  public string id { get; set; } = string.Empty;
  public string symbol	 { get; set; } = string.Empty;
  public string name { get; set; } = string.Empty;
}

public class CoinSimple : Coin
{
  // Renamed to avoid collision
  [JsonPropertyName("image")]
  public object? ImageUrl { get; set; } = string.Empty;

  public double? market_cap { get; set; }
  public double? total_volume { get; set; }
  public double? price_change_percentage_24h { get; set; }
  public double? current_price { get; set; }
}

public class Market
{
    public string? Name { get; set; }
    public string? Identifier { get; set; }
    [JsonPropertyName("has_trading_incentive")]
    public bool? HasTradingIncentive { get; set; }
    [JsonPropertyName("trade_url")]
    public bool? HasReferralParams { get; set; }
}

public class Ticker
{
    public string? Base { get; set; }
    public string? Target { get; set; }
    public Market? Market { get; set; }
    public decimal? Last { get; set; }
    public decimal? Volume { get; set; }

    
    [JsonPropertyName("trust_score")]
    public string? TrustScore { get; set; }
    [JsonPropertyName("bid_ask_spread_percentage")]
    public decimal? BidAskSpreadPercentage { get; set; }
    public DateTime? Timestamp { get; set; }
    [JsonPropertyName("last_traded_at")]
    public DateTime? LastTradedAt { get; set; }
    [JsonPropertyName("last_fetch_at")]
    public DateTime? LastFetchAt { get; set; }
    [JsonPropertyName("is_anomaly")]
    public bool? IsAnomaly { get; set; }
    [JsonPropertyName("is_stale")]
    public bool? IsStale { get; set; }
    [JsonPropertyName("trade_url")]
    public string? TradeUrl { get; set; }
    [JsonPropertyName("coin_id")]
    public string? CoinId { get; set; }

    [JsonPropertyName("target_coin_id")]
    public string? TargetCoinId { get; set; }
}

public class CoinImage
{
    public string? Thumb { get; set; }
    public string? Small { get; set; }
    public string? Large { get; set; }
}

public class CoinAdvanced : Coin
{
    [JsonPropertyName("web_slug")]
    public string? WebSlug { get; set; }
    [JsonPropertyName("image")]
    public CoinImage? ImageAdvanced { get; set; } // Updated to handle nested image structure

   public List<Ticker> Tickers { get; set; } = new List<Ticker>();

    [JsonPropertyName("block_time_in_minutes")]
    public int? BlockTimeInMinutes { get; set; }
    [JsonPropertyName("hashing_algorithm")]
    public string? HashingAlgorithm { get; set; }
    public List<string> Categories { get; set; } = new List<string>();
    public bool PreviewListing { get; set; }
    public string? PublicNotice { get; set; }
    [JsonPropertyName("additional_notices")]
    public List<string> AdditionalNotices { get; set; } = new List<string>();
    public Dictionary<string, string> Localization { get; set; } = new Dictionary<string, string>();

    public CoinDescription Description { get; set; } = new CoinDescription();

    [JsonPropertyName("market_data")]
    public MarketData MarketData { get; set; } = new MarketData();
}

public class DetailPlatform
{
    public int? DecimalPlace { get; set; }
    public string? ContractAddress { get; set; }
}

public class CoinDescription
{
    public string? En { get; set; }
}

public class MarketData
{
    [JsonPropertyName("current_price")]
    public Currencies? CurrentPrice { get; set; }

    [JsonPropertyName("market_cap")]
    public Currencies? MarketCap { get; set; }

    [JsonPropertyName("total_volume")]
    public Currencies? TotalVolume { get; set; }

    [JsonPropertyName("price_change_24h")]
    public decimal? PriceChange24h { get; set; }
    public Currencies? Ath { get; set; }
    public Currencies? Atl { get; set; }

    [JsonPropertyName("market_cap_rank")]
    public int? MarketCapRank { get; set; }

    [JsonPropertyName("price_change_percentage_24h_in_currency")]
    public Currencies? PriceChange24hInCurrency { get; set; }

    [JsonPropertyName("total_supply")]
    public decimal? TotalSupply { get; set; }

    [JsonPropertyName("max_supply")]
    public decimal? MaxSupply { get; set; }

    [JsonPropertyName("max_supply_infinite")]
    public bool? MaxSupplyInfinite { get; set; }

    [JsonPropertyName("circulating_supply")]
    public decimal? CirculatingSupply { get; set; }

    [JsonPropertyName("last_updated")]
    public string? LastUpdated { get; set; }
}

public class Currencies
{
    public decimal? Btc { get; set; }
    public decimal? Eth { get; set; }
    public decimal? Usd { get; set; }
}
