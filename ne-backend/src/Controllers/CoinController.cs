
using CoinGeckoAPI.Shared.Scripts;
using CoinGeckoAPI.Shared.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CoinGeckoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoinController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IRedisService _redisService;
        private readonly CoinService _coinService;

        public CoinController(IHttpClientFactory httpClientFactory, IRedisService redisService, CoinService coinService)
        {
          _httpClient = httpClientFactory.CreateClient();
          _redisService = redisService;
          _coinService = coinService;
        }

        // GET: api/coin/{id}
        [HttpGet("{coinId}")]
        public async Task<IActionResult> GetCoin(string coinId)
        {
          try
          {
            CoinAdvanced? coin = await _coinService.GetCoinAsync(coinId);
            if (coin == null)
            {
              return NotFound(new { Message = $"Coin with ID '{coinId}' not found." });
            }
            return Ok(coin);
          }
          catch (Exception ex)
          {
            return StatusCode(500, new { Error = ex.Message });
          }
        }
    }
}
