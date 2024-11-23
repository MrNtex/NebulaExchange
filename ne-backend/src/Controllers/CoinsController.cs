using CoinApi.Services;
using CoinGeckoAPI.Shared.Scripts;
using CoinGeckoAPI.Shared.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CoinGeckoAPI.Controllers
{
    [ApiController]
    [Route("api/coin")]
    public class CoinController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly RedisCacheService _redisCacheService;

        public CoinController(IHttpClientFactory httpClientFactory, RedisCacheService redisCacheService)
        {
          _httpClient = httpClientFactory.CreateClient();
          _redisCacheService = redisCacheService;
        }

        // GET: api/coin/{id}
        [HttpGet("{coinName}")]
        public async Task<IActionResult> GetCoin(string coinName)
        {
          return Ok(new { Message = "This endpoint is not implemented yet." });
          string redisKey = $"coin:{coinName.ToLower()}";
          var coinData = await _redisCacheService.GetDataAsync<object>(redisKey);

          if (coinData != null)
          {
            return Ok(new { Source = "Redis", Data = coinData });
          }

          try
          {
            var response = await _httpClient.GetAsync($"https://api.coingecko.com/api/v3/coins/{coinName}");
            if (!response.IsSuccessStatusCode)
            {
              return NotFound(new { Message = "Coin not found on CoinGecko." });
            }

            var coinDataFromApi = await response.Content.ReadAsStringAsync();
            var coinJson = JsonSerializer.Deserialize<object>(coinDataFromApi);

            // Cache the response in Redis for 5 minutes
            await _redisCacheService.SetDataAsync(redisKey, coinJson, TimeSpan.FromMinutes(5));

            return Ok(new { Source = "CoinGecko", Data = coinJson });
          }
          catch (Exception ex)
          {
            return StatusCode(500, new { Message = "Error contacting CoinGecko.", Error = ex.Message });
          }
        }
    }
}
