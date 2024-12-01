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

        public async Task<Coin?> GetCoinAsync(string coinId)
        {
            // Check Redis cache first
            string redisKey = $"coin:{coinId}";
            string? cachedCoin = await _redisDatabase.GetValueAsync(redisKey);
            
            if (!string.IsNullOrEmpty(cachedCoin))
            {
                return JsonSerializer.Deserialize<Coin>(cachedCoin);
            }

            // Fetch from external API
            HttpResponseMessage response = await _httpClient.GetAsync($"https://api.coingecko.com/api/v3/coins/{coinId}");
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to fetch coin data for {coinId}");
            }

            string responseContent = await response.Content.ReadAsStringAsync();
            Coin? coin = JsonSerializer.Deserialize<Coin>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (coin != null)
            {
                // Save to Redis
                await _redisDatabase.SetValueAsync(redisKey, JsonSerializer.Serialize(coin), TimeSpan.FromMinutes(10));
            }

            return coin;
        }
    }
}