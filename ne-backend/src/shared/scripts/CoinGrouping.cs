
using System.Linq;
using CoinGeckoAPI.Shared.BackgroundServices;

namespace CoinGeckoAPI.Shared.Scripts
{
    public class CoinGrouping
    {
        public static List<Coin> byMarketCap = new List<Coin>();
        public static List<Coin> byVolume = new List<Coin>();
        public static List<Coin> byPriceChange = new List<Coin>();
        public static void GroupCoins(Coin[] coins)
        {
          if (coins == null || coins.Length == 0)
          {
            Console.WriteLine("No coins found.");
            return;
          }
          // Ensure no individual Coin is null before processing
          var validCoins = coins.Where(c => c != null).ToArray();

          if (validCoins.Length == 0)
          {
              Console.WriteLine("No valid coins to process.");
              return;
          }

          // Safely check if market_cap, total_volume, and price_change_percentage_24h are not null
          byMarketCap = validCoins
              .Where(c => c.market_cap.HasValue)  // Ensure market_cap is not null
              .OrderByDescending(c => c.market_cap.Value)
              .ToList();

          byVolume = validCoins
              .Where(c => c.total_volume.HasValue)  // Ensure total_volume is not null
              .OrderByDescending(c => c.total_volume.Value)
              .ToList();

          byPriceChange = validCoins
              .Where(c => c.price_change_percentage_24h.HasValue)  // Ensure price_change_percentage_24h is not null
              .OrderByDescending(c => c.price_change_percentage_24h.Value)
              .ToList();
        }
    }
}