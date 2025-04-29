namespace MedicalArchive.API.Domain.Entities
{
    public class MedicalCertificate
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required DateTime IssueDate { get; set; }
        public required string Description { get; set; }
        public int UserId { get; set; }
        public string? DocumentFilePath { get; set; }

        // Навігаційні властивості
        public virtual User? User { get; set; }
    }
}
