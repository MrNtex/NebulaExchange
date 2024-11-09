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
        public IActionResult GetCoins()
        {
            var coins = coinService.GetCoins(); 
            if (coins == null || coins.Count == 0)
            {
                return NotFound("No coins found.");
            }

            return Ok(coins);
        }
    }
}
