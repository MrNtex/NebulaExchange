
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

        public CoinController(IHttpClientFactory httpClientFactory, IRedisService redisService)
        {
          _httpClient = httpClientFactory.CreateClient();
          _redisService = redisService;
        }

        // GET: api/coin/{id}
        [HttpGet("{coinName}")]
        public IActionResult GetCoin(string coinName)
        {
          return Ok(new { Message = "This endpoint is not implemented yet." });
        }
        
    }
}
