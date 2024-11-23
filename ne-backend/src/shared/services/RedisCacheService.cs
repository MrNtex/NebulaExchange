using StackExchange.Redis;
using System.Text.Json;

namespace CoinApi.Services
{
    public class RedisCacheService
    {
        private readonly IDatabase _db;

        public RedisCacheService(string redisConnection)
        {
            var connection = ConnectionMultiplexer.Connect(redisConnection);
            _db = connection.GetDatabase();
        }

        public async Task<T?> GetDataAsync<T>(string key)
        {
            var value = await _db.StringGetAsync(key);
            return value.HasValue ? JsonSerializer.Deserialize<T>(value) : default;
        }

        public async Task SetDataAsync<T>(string key, T data, TimeSpan? expiry = null)
        {
            var value = JsonSerializer.Serialize(data);
            await _db.StringSetAsync(key, value, expiry);
        }
    }
}
