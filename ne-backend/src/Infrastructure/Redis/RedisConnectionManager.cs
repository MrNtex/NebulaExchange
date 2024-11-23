using StackExchange.Redis;

/// <summary>
/// Implementation of the Redis service for caching operations.
/// </summary>
public class RedisService : IRedisService
{
    private readonly IDatabase _db;

    /// <summary>
    /// Initializes a new instance of the <see cref="RedisService"/> class.
    /// </summary>
    /// <param name="connectionString">The connection string for the Redis server.</param>
    public RedisService(string connectionString)
    {
        var redis = ConnectionMultiplexer.Connect(connectionString);
        _db = redis.GetDatabase();
    }

    /// <inheritdoc />
    public async Task<string> GetValueAsync(string key)
    {
        if (string.IsNullOrEmpty(key))
        {
            throw new ArgumentException("Key cannot be null or empty.", nameof(key));
        }

        // Retrieve the value from Redis
        var value = await _db.StringGetAsync(key);
        return value.IsNullOrEmpty ? string.Empty : value.ToString();
    }

    /// <inheritdoc />
    public async Task SetValueAsync(string key, string value)
    {
        if (string.IsNullOrEmpty(key))
        {
            throw new ArgumentException("Key cannot be null or empty.", nameof(key));
        }

        if (value == null)
        {
            throw new ArgumentNullException(nameof(value), "Value cannot be null.");
        }

        // Store the key-value pair in Redis
        await _db.StringSetAsync(key, value);
    }
}
