
using CoinGeckoAPI.Shared.Scripts;
using CoinGeckoAPI.Shared.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CoinGeckoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PredictionController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IRedisService _redisService;
        private readonly PredictionService _predictionService;

        public PredictionController(IHttpClientFactory httpClientFactory, IRedisService redisService, PredictionService predictionService)
        {
          _httpClient = httpClientFactory.CreateClient();
          _redisService = redisService;
          _predictionService = predictionService;
        }

        // GET: api/prediction/{id}
        /// <summary>
        /// Predicts a specific coin by ID
        /// </summary>
        /// <remarks>NOW ONLY WORKS FOR BITCOIN</remarks>
        /// <param name="coinId"></param>
        /// <response code="200">Returns the prediction</response>
        /// <response code="404">If the coin is not found</response>
        [HttpGet("{coinId}")]
        public IActionResult Predict(string coinId)
        {
          Prediction prediction = _predictionService.GetPredictions(coinId);
          if (prediction == null)
          {
            return NotFound(new { Message = $"Coin with ID '{coinId}' not found." });
          }
          return Ok(prediction);
        }
    }
}
