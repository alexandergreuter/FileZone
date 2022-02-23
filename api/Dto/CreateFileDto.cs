namespace FileZone.Dto;

public class CreateFileDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Password { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public IFormFile File { get; set; }

    public CreateFileDto() { }
}
