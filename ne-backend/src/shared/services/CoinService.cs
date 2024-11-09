using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;

namespace CoinGeckoAPI.Shared.Services
{
    public class CoinService
    {
        private readonly HttpClient httpClient;
        private List<Coin> coins;

        public CoinService(HttpClient httpClient)
        {
            this.httpClient = httpClient;
            this.coins = new List<Coin>();
        }

        // Ensures coin data is fetched asynchronously before returning it
        public async Task<List<Coin>> GetCoinsAsync()
        {
            // If no coins are fetched yet, fetch them
            if (coins.Count == 0)
            {
                await FetchCoinData();  // Wait for the coins to be fetched
            }

            Console.WriteLine($"{DateTime.Now}: Returning {coins.Count} coins.");
            return coins;
        }

        // Fetches coins asynchronously from the API
        private async Task FetchCoinData()
        {
            try
            {
                coins = await httpClient.GetFromJsonAsync<List<Coin>>("https://api.coingecko.com/api/v3/coins/list") ?? new List<Coin>();
                Console.WriteLine($"{DateTime.Now}: Fetched {coins.Count} coins.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching coin data: {ex.Message}");
            }
        }
    }

    public class Coin
    {
        public string Id { get; set; } = string.Empty;
        public string Symbol { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
