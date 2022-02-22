namespace FileZone.Dto;

public class CreateFileDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public IFormFile File { get; set; }

    public CreateFileDto() { }
}
