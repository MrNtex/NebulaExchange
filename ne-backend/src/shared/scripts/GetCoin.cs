
using System.Linq;
using CoinGeckoAPI.Shared.BackgroundServices;
namespace CoinGeckoAPI.Shared.Scripts{
  public class FetchCoinData
  {
    private readonly HttpClient httpClient;

    public FetchCoinData(HttpClient httpClient)
    {
      this.httpClient = httpClient;
    }

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
          currentPage++;

          var fetchedCoins = await response.Content.ReadFromJsonAsync<Coin[]>() ?? new Coin[250];
          for (int j = 0; j < fetchedCoins.Length; j++)
          {
            coins[currentPage * MAX_COINS + j] = fetchedCoins[j];

            try
            {
              var redisKey = $"coin_data_{ fetchedCoins[j].id }";
              var jsonData = JsonSerializer.Serialize(fetchedCoins[j]);
              await _redisCacheService.SetValueAsync(redisKey, jsonData);
            }
            catch (Exception ex)
            {
              Console.WriteLine($"Error storing coin data in Redis: {ex.Message}");
            }
            
          }
          Console.WriteLine($"Coin data for page {currentPage} successfully stored in Redis.");
          
        }
        else
        {
          var responseBody = await response.Content.ReadAsStringAsync();
          Console.WriteLine($"Error fetching coin data: {responseBody}");
        }
      }

      if (currentPage >= MAX_PAGES)
      {
        currentPage = 0;
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
    public static Coin GetCoin(string coinName)
    {
        


        return new Coin();
    }
  }
}