using FileZone.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FileZone.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly FileZoneDbContext _context;

        public UploadsController(FileZoneDbContext context)
        {
            _context = context;
        }

        // GET: api/files
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Upload>>> GetUploads()
        {
            return await _context.Uploads.ToListAsync();
        }

        // GET: api/files/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Upload>> GetUpload(long id)
        {
            var file = await _context.Uploads.FindAsync(id);

            if (file == null)
            {
                return NotFound();
            }

            return file;
        }

        // PUT: api/files/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUpload(long id, Upload file)
        {
            if (id != file.Id)
            {
                return BadRequest();
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
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/files
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Upload>> PostUpload(Upload file)
        {
            _context.Uploads.Add(file);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFile", new { id = file.Id }, file);
        }

        // DELETE: api/files/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUpload(long id)
        {
            var file = await _context.Uploads.FindAsync(id);
            if (file == null)
            {
                return NotFound();
            }

            _context.Uploads.Remove(file);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UploadExists(long id)
        {
            return _context.Uploads.Any(e => e.Id == id);
        }
    }
}
