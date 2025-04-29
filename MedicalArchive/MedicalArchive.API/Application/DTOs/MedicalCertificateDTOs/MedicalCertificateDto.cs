namespace MedicalArchive.API.Application.DTOs.MedicalCertificateDTOs
{
    public class MedicalCertificateDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required DateTime IssueDate { get; set; }
        public required string Description { get; set; }
        public int UserId { get; set; }
        public string? DocumentFilePath { get; set; }
    }
}
