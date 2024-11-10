using CoinGeckoAPI.Shared.Scripts;
using CoinGeckoAPI.Shared.Services;
using Microsoft.Extensions.Hosting;
using System;
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

    public static List<Coin> coins = new List<Coin>();
    public CoinDataBackgroundService(CoinService coinService, HttpClient httpClient)
    {
        this.coinService = coinService;
        this.httpClient = httpClient;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        // Start fetching data immediately and then periodically every 5 minutes
        timer = new Timer(
            async _ => await FetchCoinData(), // Fetch data every 5 minutes
            null,
            TimeSpan.Zero,
            TimeSpan.FromMinutes(5)
        );

        Console.WriteLine("CoinDataBackgroundService started.");

        return Task.CompletedTask;
    }

  const int MAX_COINS = 250;
  const int MAX_PAGES = 3;
    private async Task FetchCoinData()
    {
      coins.Clear();
      httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("NebulaExchange/2.0");
      try
      {
        for (int i = 1; i <= MAX_PAGES; i++)
        {
          var response = await httpClient.GetAsync($"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={MAX_COINS}&page={i}");
          if (response.IsSuccessStatusCode)
          {
            coins.AddRange(await response.Content.ReadFromJsonAsync<List<Coin>>() ?? new List<Coin>());
          }
          else
          {
            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Error fetching coin data: {responseBody}");
          }
        }
        
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error fetching coin data: {ex.Message}");
      }
      finally
      {
        CoinGrouping.GroupCoins(coins);
        Console.WriteLine($"{DateTime.Now}: Fetched {coins.Count} coins.");
      }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
      timer?.Change(Timeout.Infinite, 0);
      return Task.CompletedTask;
    }
  }
}
