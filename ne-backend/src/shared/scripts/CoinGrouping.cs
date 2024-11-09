
using System.Linq;
using CoinGeckoAPI.Shared.BackgroundServices;

namespace CoinGeckoAPI.Shared.Scripts
{
    public class CoinGrouping
    {
        public static List<Coin> byMarketCap = new List<Coin>();
        public static List<Coin> byVolume = new List<Coin>();
        public static List<Coin> byPriceChange = new List<Coin>();
        public static void GroupCoins(List<Coin> coins)
        {
          byMarketCap = coins.OrderByDescending(c => c.market_cap).ToList();
          byVolume = coins.OrderByDescending(c => c.total_volume).ToList();
          byPriceChange = coins.OrderByDescending(c => c.price_change_percentage_24h).ToList();
        }
    }
}