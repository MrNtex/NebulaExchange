using CoinGeckoAPI.Shared.Services;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CoinGeckoAPI.Shared.BackgroundServices
{
  public class Coin
  {
    public string Id { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
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

    public Task StopAsync(CancellationToken cancellationToken)
    {
      timer?.Change(Timeout.Infinite, 0);
      return Task.CompletedTask;
    }
  }
}
