
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

        [HttpGet("simple/{coinId}")]
        public async Task<IActionResult> GetSimpleCoin(string coinId)
        {
          try
          {
            CoinSimple? coin = await _coinService.GetSimpleCoin(coinId);
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

        // GET: api/coin/{id}
        /// <summary>
        /// Get a specific coin by ID
        /// </summary>
        /// <remarks>Returns advanced info</remarks>
        /// <param name="coinId"></param>
        /// <response code="200">Returns the coin</response>
        /// <response code="404">If the coin is not found</response>
        /// <response code="500">If an error occurs</response>
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

        [HttpGet("{coinId}/chart/{days}")]
        public async Task<IActionResult> GetCoinChart(string coinId, string days)
        {
          try
          {
            CoinChart? coinChart = await _coinService.GetCoinChartAsync(coinId, days);
            if (coinChart == null)
            {
              return NotFound(new { Message = $"Coin with ID '{coinId}' not found." });
            }
            return Ok(coinChart);
          }
          catch (Exception ex)
          {
            return StatusCode(500, new { Error = ex.Message });
          }
        }
    }
}
