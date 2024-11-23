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

// Add Redis service to the DI container
builder.Services.AddSingleton<IRedisService>(sp =>
{
    var connectionString = builder.Configuration["Redis:ConnectionString"];
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new ArgumentNullException(nameof(connectionString), "Redis connection string cannot be null or empty.");
    }
    return new RedisService(connectionString);
});

//builder.Services.AddSingleton<CoinService>();
// Register CoinDataBackgroundService to start background fetching immediately
builder.Services.AddHostedService<CoinDataBackgroundService>();

builder.Services.AddControllers();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(80);  // Listen on all interfaces on port 80
});

var app = builder.Build();

app.UseCors("AllowNextJs");

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
