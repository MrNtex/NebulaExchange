using CoinGeckoAPI.Shared.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<CoinService>(client =>
{
    client.BaseAddress = new Uri("https://api.coingecko.com/api/v3/");
});
//builder.Services.AddSingleton<CoinService>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
