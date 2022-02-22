using FileZone.Dto;
using FileZone.Models;
using Microsoft.EntityFrameworkCore;

namespace FileZone.Services;

public class UploadsService : IUploadsService
{
    private readonly FileZoneDbContext _context;

    public UploadsService(FileZoneDbContext context)
    {
        _context = context;
    }

    public async Task<List<Upload>> GetUploads()
    {
        return await _context.Uploads.ToListAsync();
    }

    public async Task<Upload?> GetUploadById(long id)
    {
        var file = await _context.Uploads.FindAsync(id);

        if (file == null)
        {
            return null;
        }

        return file;
    }

    public async Task<Upload?> GetUploadByHash(string hash)
    {
        var file = await _context.Uploads.FirstOrDefaultAsync(f => f.Hash == hash);

        if (file == null)
        {
            return null;
        }

        return file;
    }

    public async Task<Upload?> EditUpload(long id, Upload file)
    {
        if (id != file.Id)
        {
            return null;
        }

        _context.Entry(file).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UploadExists(id))
            {
                return null;
            }
            else
            {
                throw;
            }
        }

        return file;
    }

    public async Task<Upload> CreateUpload(CreateFileDto dto, string filename)
    {
        var file = new Upload
        {
            Filename = filename,
            Title = dto.Title,
            Description = dto.Description,
            Hash = Guid.NewGuid().ToString(),
        };
        _context.Uploads.Add(file);
        await _context.SaveChangesAsync();

        return file;
    }

    public void DeleteUpload(long id)
    {
        var file = _context.Uploads.Find(id);

        if (file != null)
        {
            _context.Uploads.Remove(file);
            _context.SaveChanges();
        }
    }

    public bool UploadExists(long id)
    {
        return _context.Uploads.Any(e => e.Id == id);
    }
}
