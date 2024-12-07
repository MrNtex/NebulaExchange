/// <summary>
/// Interface for Redis service to handle caching operations.
/// </summary>
public interface IRedisService
{
    /// <summary>
    /// Retrieves the value associated with the specified key from Redis.
    /// </summary>
    /// <param name="key">The key whose value needs to be retrieved.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the value as a string.</returns>
    Task<string> GetValueAsync(string key);

    /// <summary>
    /// Sets a key-value pair in Redis.
    /// </summary>
    /// <param name="key">The key to be added or updated.</param>
    /// <param name="value">The value to associate with the key.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task SetValueAsync(string key, string value, TimeSpan? expiry = null);

    /// <summary>
    /// Removes a key from Redis.
    /// </summary>
    /// <param name="key">The key to be removed.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    /// 
    Task RemoveKeyAsync(string key);
}
