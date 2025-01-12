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
            string filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Predictions", "future_predictions.csv");

            // Check if file exists before proceeding
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Predictions file not found at {filePath}");
            }

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