namespace FileZone.Models;

public class Upload
{
    public long Id { get; set; }
    public string Hash { get; set; }
    public string Filename
    {
        get; set;
    }
    public string Title { get; set; }
    public string Description { get; set; }

    public Upload() { }
}
