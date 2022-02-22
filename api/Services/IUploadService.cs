using FileZone.Models;

namespace FileZone.Services;

public interface IUploadService
{
    Task<List<Upload>> GetUploads();
    Task<Upload?> GetUpload(long id);
    Task<Upload?> EditUpload(long id, Upload file);
    Task<Upload> CreateUpload(Upload file);
    void DeleteUpload(long id);
    bool UploadExists(long id);
}
