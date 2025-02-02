using CoinGeckoAPI.Shared.BackgroundServices;
using CoinGeckoAPI.Shared.Services;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;

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

builder.Services.AddHttpClient("RedisCacheClient", client =>
{
    client.BaseAddress = new Uri("http://localhost:6379/");
});

// Add Redis service to the DI container
// RedisService setup without HttpClient
builder.Services.AddSingleton<IRedisService, RedisService>(sp =>
{
    var connectionString = builder.Configuration["Redis:ConnectionString"];
    
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new ArgumentNullException(nameof(connectionString), "Redis connection string cannot be null or empty.");
    }

    return new RedisService(connectionString);
});

builder.Services.AddScoped<PredictionService>();

// Add CoinService
builder.Services.AddSingleton<CoinService>();


//builder.Services.AddSingleton<CoinService>();
// Register CoinDataBackgroundService to start background fetching immediately
builder.Services.AddHostedService<CoinDataBackgroundService>();

builder.Services.AddControllers();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(80);  // Listen on all interfaces on port 80
});
builder.Services.AddLogging();

builder.Services.AddMvc();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "ne_backend", Version = "v1" });
});

var app = builder.Build();

app.UseCors("AllowNextJs");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.MapControllers();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "My API V1");
});
app.Run();
