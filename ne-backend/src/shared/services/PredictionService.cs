using System.Globalization;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;

namespace CoinGeckoAPI.Shared.Services {
    public class PredictionService
    {
        private readonly HttpClient _httpClient;
        private readonly IRedisService _redisDatabase;

        public PredictionService(HttpClient httpClient, IRedisService redisDatabase)
        {
            _httpClient = httpClient;
            _redisDatabase = redisDatabase;
        }

        public Prediction GetPredictions(string coinId)
        {
            // TODO: Add redis cache for predictions

            string filePath = $"Predictions/future_predictions.csv";

            using (var reader = new StreamReader(filePath))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var records = csv.GetRecords<PredictionRecord>().ToList();

                Prediction prediction = new Prediction(coinId, records);

                return prediction;
            }
        }
    }
}