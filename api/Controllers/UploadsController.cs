using FileZone.Models;
using FileZone.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FileZone.Controllers
{

    [Route("api/files")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly IUploadsService _uploadService;

        public UploadsController(IUploadsService uploadService)
        {
            _uploadService = uploadService;
        }

        // GET: api/files/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Upload>> GetUpload(long id)
        {
            var file = await _uploadService.GetUpload(id);

            if (file == null)
            {
                return NotFound();
            }

            return file;
        }

        // POST: api/files
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Upload>> PostUpload([FromBody] Upload file)
        {
            var f = await _uploadService.CreateUpload(file);

            return CreatedAtAction(nameof(GetUpload), new { id = f.Id }, f);
        }
    }
}
