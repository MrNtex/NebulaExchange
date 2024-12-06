using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace CoinGeckoAPI.Shared.Services {
    public class CoinService
    {
        private readonly HttpClient _httpClient;
        private readonly IRedisService _redisDatabase;

        public CoinService(HttpClient httpClient, IRedisService redisDatabase)
        {
            _httpClient = httpClient;
            _redisDatabase = redisDatabase;
        }

        public async Task<CoinAdvanced?> GetCoinAsync(string coinId)
        {
            // Check Redis cache first
            string redisKey = $"coin:{coinId}";
            string? cachedCoin = await _redisDatabase.GetValueAsync(redisKey);
            
            if (!string.IsNullOrEmpty(cachedCoin))
            {
                return JsonSerializer.Deserialize<CoinAdvanced>(cachedCoin);
            }

            // Fetch from external API
            HttpResponseMessage response = await _httpClient.GetAsync($"https://api.coingecko.com/api/v3/coins/{coinId}");
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to fetch coin data for {coinId}");
            }

            CoinAdvanced? coin = await response.Content.ReadFromJsonAsync<CoinAdvanced>();

            if (coin != null)
            {
                // Save to Redis
                await _redisDatabase.SetValueAsync(redisKey, JsonSerializer.Serialize(coin), TimeSpan.FromMinutes(10));
            }

            return coin;
        }

        /// <summary>
        /// Get the chart data for a specific coin.
        /// </summary>
        /// <param name="coinId"></param>
        /// <param name="days"> String because days accepts max</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<CoinChart?> GetCoinChartAsync(string coinId, string days)
        {
            // Check Redis cache first
            string redisKey = $"coin:{coinId}:chart:{days}";
            string? cachedChart = await _redisDatabase.GetValueAsync(redisKey);
            
            if (!string.IsNullOrEmpty(cachedChart))
            {
                return JsonSerializer.Deserialize<CoinChart>(cachedChart);
            }

            // Fetch from external API
            HttpResponseMessage response = await _httpClient.GetAsync($"https://api.coingecko.com/api/v3/coins/{coinId}/market_chart?vs_currency=usd&days={days}");
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to fetch coin chart data for {coinId}");
            }

            CoinChart? coinChart = await response.Content.ReadFromJsonAsync<CoinChart>();

            if (coinChart != null)
            {
                // Save to Redis
                await _redisDatabase.SetValueAsync(redisKey, JsonSerializer.Serialize(coinChart), TimeSpan.FromMinutes(10));
            }

            return coinChart;
        }
    }
}