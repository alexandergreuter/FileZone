using FileZone.Dto;
using FileZone.Models;

namespace FileZone.Services;

public interface IUploadsService
{
    Task<List<Upload>> GetUploads();
    Task<Upload?> GetUploadById(long id);
    Task<Upload?> GetUploadByHash(string hash);
    Task<Upload?> EditUpload(long id, Upload file);
    Task<Upload> CreateUpload(CreateFileDto file, string filename);
    void DeleteUpload(long id);
    bool UploadExists(long id);
    bool AuthorizedUpload(Upload file, string password);
}
