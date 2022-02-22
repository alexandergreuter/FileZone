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
        private readonly IUploadService _uploadService;

        public UploadsController(IUploadService uploadService)
        {
            _uploadService = uploadService;
        }

        // GET: api/files
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Upload>>> GetUploads()
        {
            return await _uploadService.GetUploads();
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

        // PUT: api/files/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUpload(long id, [FromBody] Upload file)
        {
            if (id != file.Id)
            {
                return BadRequest();
            }

            var f = await _uploadService.EditUpload(id, file);

            if (f == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/files
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Upload>> PostUpload([FromBody] Upload file)
        {
            var f = await _uploadService.CreateUpload(file);

            return CreatedAtAction(nameof(GetUpload), new { id = f.Id }, f);
        }

        // DELETE: api/files/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUpload(long id)
        {
            var file = await _uploadService.GetUpload(id);
            if (file == null)
            {
                return NotFound();
            }

            _uploadService.DeleteUpload(id);

            return NoContent();
        }
    }
}
