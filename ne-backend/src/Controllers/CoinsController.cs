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
        public async Task<IActionResult> GetCoins()
        {
            var coins = await coinService.GetCoinsAsync(); // Await the async method
            if (coins == null || coins.Count == 0)
            {
                return NotFound("No coins found.");
            }

            return Ok(coins);
        }
    }
}
