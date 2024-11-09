using CoinGeckoAPI.Shared.Scripts;
using CoinGeckoAPI.Shared.Services;
using Microsoft.AspNetCore.Mvc;

namespace CoinGeckoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoinsController : ControllerBase
    {
        private readonly CoinService coinService;

        public CoinsController(CoinService coinService)
        {
            this.coinService = coinService;
        }

        // GET: api/coins
        [HttpGet]
        public IActionResult GetCoins([FromQuery] int limit = 3)
        {
            var coins = coinService.GetCoins(); 
            if (coins == null || coins.Count == 0)
            {
                return NotFound("No coins found.");
            }

            return Ok(coins.Take(limit));
        }

        // GET: api/coins/marketcap
        [HttpGet("marketcap")]
        public IActionResult GetCoinsByMarketCap([FromQuery] int limit = 3)
        {
            var coins = CoinGrouping.byMarketCap;
            if (coins == null || coins.Count == 0)
            {
                return NotFound("No coins found.");
            }

            return Ok(coins.Take(limit));
        }

        // GET: api/coins/volume
        [HttpGet("volume")]
        public IActionResult GetCoinsByVolume([FromQuery] int limit = 3)
        {
            var coins = CoinGrouping.byVolume;
            if (coins == null || coins.Count == 0)
            {
                return NotFound("No coins found.");
            }

            return Ok(coins.Take(limit));
        }

        // GET: api/coins/pricechange
        [HttpGet("pricechange")]
        public IActionResult GetCoinsByPriceChange([FromQuery] int limit = 3)
        {
            var coins = CoinGrouping.byPriceChange;
            if (coins == null || coins.Count == 0)
            {
                return NotFound("No coins found.");
            }

            return Ok(coins.Take(limit));
        }
    }
}
