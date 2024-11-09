using CoinGeckoAPI.Shared.BackgroundServices;
using CoinGeckoAPI.Shared.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<CoinService>(client =>
{
    client.BaseAddress = new Uri("https://api.coingecko.com/api/v3/");
});

// Add CORS policy to allow requests from localhost:3000 (Next.js)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Next.js origin
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

//builder.Services.AddSingleton<CoinService>();
// Register CoinDataBackgroundService to start background fetching immediately
builder.Services.AddHostedService<CoinDataBackgroundService>();

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowNextJs");

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
