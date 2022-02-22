using FileZone.Models;
using Microsoft.EntityFrameworkCore;

namespace FileZone;

public class FileZoneDbContext : DbContext
{
    public DbSet<Upload> Uploads { get; set; } = null!;

    public FileZoneDbContext(DbContextOptions<FileZoneDbContext> options) : base(options) { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSnakeCaseNamingConvention();
    }
}
