using System.Globalization;
using FileZone;
using FileZone.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<RequestLocalizationOptions>(options =>
      {
          options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture("de-CH");
          options.SupportedCultures = new List<CultureInfo> { new CultureInfo("de-CH") };
      });

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<IUploadsService, UploadsService>();
builder.Services.AddDbContext<FileZoneDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("FileZone"));
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
