using FileZone.Dto;
using FileZone.Models;
using FileZone.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace FileZone.Controllers
{

    [Route("api/files")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IUploadsService _uploadService;

        public UploadsController(IConfiguration config, IUploadsService uploadService)
        {
            _config = config;
            _uploadService = uploadService;
        }

        // GET: api/files/{hash}
        [HttpGet("{hash}")]
        public async Task<ActionResult<Upload>> GetUpload(string hash)
        {
            var file = await _uploadService.GetUploadByHash(hash);

            if (file == null)
            {
                return NotFound();
            }

            return file;
        }

        // GET: api/files/5/download
        [HttpGet("{hash}/download")]
        public async Task<ActionResult> DownloadUpload(string hash)
        {
            const string DefaultContentType = "application/octet-stream";

            var file = await _uploadService.GetUploadByHash(hash);

            if (file == null)
            {
                return NotFound();
            }

            var filePath = Path.Combine(_config["UploadsPath"], file.Filename);

            var provider = new FileExtensionContentTypeProvider();

            if (!provider.TryGetContentType(filePath, out string? contentType))
            {
                contentType = DefaultContentType;
            }

            Stream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            return new FileStreamResult(stream, contentType)
            {
                FileDownloadName = file.Filename
            };
        }

        // POST: api/files
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // Limited to 10GIB
        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 10737418240)]
        [RequestSizeLimit(10737418240)]
        public async Task<ActionResult<Upload>> PostUpload([FromForm] CreateFileDto file)
        {
            var filename = Path.GetRandomFileName() + Path.GetExtension(file.File.FileName);

            using (var stream = new FileStream(Path.Join(_config["UploadsPath"], filename).ToString(), FileMode.Create))
            {
                await file.File.CopyToAsync(stream);
            }

            var f = await _uploadService.CreateUpload(file, filename);

            return CreatedAtAction(nameof(GetUpload), new { hash = f.Hash }, f);
        }
    }
}
