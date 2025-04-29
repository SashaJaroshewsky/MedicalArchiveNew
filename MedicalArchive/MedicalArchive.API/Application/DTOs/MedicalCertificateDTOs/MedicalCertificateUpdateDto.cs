namespace MedicalArchive.API.Application.DTOs.MedicalCertificateDTOs
{
    public class MedicalCertificateUpdateDto
    {
        public required string Title { get; set; }
        public required DateTime IssueDate { get; set; }
        public required string Description { get; set; }
        public IFormFile? Document { get; set; }
    }
}
