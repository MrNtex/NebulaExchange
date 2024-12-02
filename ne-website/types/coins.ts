export interface Coin {
  id: string;
  symbol: string;
  name: string;
}

export interface CoinSimple extends Coin {
  image?: any; // Can be refined to a specific type if known
  market_cap?: number;
  total_volume?: number;
  price_change_percentage_24h?: number;
  current_price?: number;
}

export interface Market {
  name?: string;
  identifier?: string;
  has_trading_incentive?: boolean;
  trade_url?: string;
}

export interface Ticker {
  base?: string;
  target?: string;
  market?: Market;
  last?: number;
  volume?: number;
  trust_score?: string;
  bid_ask_spread_percentage?: number;
  timestamp?: Date;
  last_traded_at?: Date;
  last_fetch_at?: Date;
  is_anomaly?: boolean;
  is_stale?: boolean;
  trade_url?: string;
  coin_id?: string;
  target_coin_id?: string;
}

export interface CoinImage {
  thumb?: string;
  small?: string;
  large?: string;
}

export interface CoinAdvanced extends Coin {
  web_slug?: string;
  image?: CoinImage;
  tickers: Ticker[];
  block_time_in_minutes?: number;
  hashing_algorithm?: string;
  categories: string[];
  preview_listing: boolean;
  public_notice?: string;
  additional_notices: string[];
  localization: Record<string, string>;
  description: CoinDescription;
  market_data: MarketData;
}

export interface DetailPlatform {
  decimal_place?: number;
  contract_address?: string;
}

export interface CoinDescription {
  en?: string;
}

export interface MarketData {
  current_price?: Currencies;
  market_cap?: Currencies;
  total_volume?: Currencies;
  price_change_24h?: number;
  ath?: Currencies;
  atl?: Currencies;
  market_cap_rank?: number;
  price_change_percentage_24h_in_currency?: Currencies;
  total_supply?: number;
  max_supply?: number;
  max_supply_infinite?: boolean;
  circulating_supply?: number;
  last_updated?: string;
}

export interface Currencies {
  btc?: number;
  eth?: number;
  usd?: number;
}
