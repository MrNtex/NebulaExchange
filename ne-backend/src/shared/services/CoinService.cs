using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace CoinGeckoAPI.Shared.Services
{
    public class CoinService
{
    private bool isDataFetched = false;

    private readonly HttpClient httpClient;
    public CoinService(HttpClient httpClient)
    {
        this.httpClient = httpClient;
    }

}
}
