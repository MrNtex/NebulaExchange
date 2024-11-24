using CoinGeckoAPI.Shared.Scripts;
using CoinGeckoAPI.Shared.Services;
using Microsoft.Extensions.Hosting;
using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace CoinGeckoAPI.Shared.BackgroundServices
{
  public class Coin
  {
    public string id { get; set; } = string.Empty;
    public string symbol	 { get; set; } = string.Empty;
    public string name { get; set; } = string.Empty;
    public string image { get; set; } = string.Empty;
    public double? market_cap { get; set; }
    public double? total_volume { get; set; }
    public double? price_change_percentage_24h { get; set; }
    public double? current_price { get; set; }
  }
  public class CoinDataBackgroundService : IHostedService
  {
    private readonly CoinService coinService;
    private Timer? timer;
    private readonly HttpClient httpClient;
    private readonly IRedisService _redisCacheService;

    public static List<Coin> coins = new List<Coin>();
    public CoinDataBackgroundService(CoinService coinService, HttpClient httpClient, IRedisService _redisCacheService)
    {
        this.coinService = coinService;
        this.httpClient = httpClient;
        this._redisCacheService = _redisCacheService;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        // Start fetching data immediately and then periodically every 5 minutes
        timer = new Timer(
            async _ => await FetchCoinData(), // Fetch data every 5 minutes
            null,
            TimeSpan.Zero,
            TimeSpan.FromMinutes(2)
        );

        Console.WriteLine("CoinDataBackgroundService started.");

        return Task.CompletedTask;
    }

  const int MAX_COINS = 250;
  const int MAX_PAGES_PER_FETCH = 3;
  const int MAX_PAGES = 15;
  static int currentPage = 0; // Keep track of the current page
    private async Task FetchCoinData()
    {
      
      httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("NebulaExchange/2.0");
      try
      {
        for (int i = 1; i <= MAX_PAGES_PER_FETCH; i++)
        {
          var response = await httpClient.GetAsync($"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={MAX_COINS}&page={currentPage+i}");
          if (response.IsSuccessStatusCode)
          {
            var fetchedCoins = await response.Content.ReadFromJsonAsync<List<Coin>>() ?? new List<Coin>();
            coins.AddRange(fetchedCoins);

            var redisKey = $"coins_data_{currentPage+i}";

            // After collecting all the data, serialize it and store it in Redis
            var jsonData = JsonSerializer.Serialize(coins);
            await _redisCacheService.SetValueAsync("coins_data", jsonData);  // Store the data in Redis with key "coins_data"
            Console.WriteLine($"Coin data for page {currentPage+i} successfully stored in Redis.");
          }
          else
          {
            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Error fetching coin data: {responseBody}");
          }
        }

        currentPage += MAX_PAGES_PER_FETCH;
        if (currentPage >= MAX_PAGES)
        {
          currentPage = 0;
          coins.Clear();
        }
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error fetching coin data: {ex.Message}");
      }
      finally
      {
        CoinGrouping.GroupCoins(coins);
      }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
      timer?.Change(Timeout.Infinite, 0);
      return Task.CompletedTask;
    }
  }
}
