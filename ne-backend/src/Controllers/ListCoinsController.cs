using CoinGeckoAPI.Shared.Scripts;
using CoinGeckoAPI.Shared.Services;
using Microsoft.AspNetCore.Mvc;

namespace CoinGeckoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListCoinsController : ControllerBase
    {
        private readonly CoinService coinService;
        private readonly IRedisService redisService;

        public ListCoinsController(CoinService coinService, IRedisService redisService)
        {
            this.coinService = coinService;
            this.redisService = redisService;
        }

        IActionResult SelectCoins(List<CoinSimple> coins, int limit, int page)
        {
            List<CoinSimple> paginatedCoins;
            if (coins == null || coins.Count == 0)
            {
                return NotFound("No coins found.");
            }

            if (page < 1)
            {
                return BadRequest("Page number must be greater than 0.");
            }
            if (limit < 1)
            {
                return BadRequest("Limit must be greater than 0.");
            }

            paginatedCoins = coins.Skip(limit * (page - 1)).Take(limit).ToList();
            return Ok(paginatedCoins);
        }
        // GET: api/coins
        [HttpGet]
        public IActionResult GetCoins([FromQuery] int limit = 3, [FromQuery] int page = 1)
        {
            // limit the number of coins returned
            // page is dempended on the limit, 
            // if the limit is 3, then page 1 will return the first 3 coins, page 2 will return the next 3 coins, and so on

            var coins = CoinGrouping.byMarketCap;
            
            return SelectCoins(coins, limit, page);
        }

        // GET: api/coins/marketcap
        [HttpGet("marketcap")]
        public IActionResult GetCoinsByMarketCap([FromQuery] int limit = 3, [FromQuery] int page = 1)
        {
            var coins = CoinGrouping.byMarketCap;

            return SelectCoins(coins, limit, page);
        }

        // GET: api/coins/volume
        [HttpGet("volume")]
        public IActionResult GetCoinsByVolume([FromQuery] int limit = 3, [FromQuery] int page = 1)
        {
            var coins = CoinGrouping.byVolume;
            
            return SelectCoins(coins, limit, page);
        }

        // GET: api/coins/pricechange
        [HttpGet("pricechange")]
        public IActionResult GetCoinsByPriceChange([FromQuery] int limit = 3, [FromQuery] int page = 1)
        {
            var coins = CoinGrouping.byPriceChange;
            
            return SelectCoins(coins, limit, page);
        }
    }
}
