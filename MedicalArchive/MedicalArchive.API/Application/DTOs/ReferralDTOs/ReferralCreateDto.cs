namespace MedicalArchive.API.Application.DTOs.ReferralDTOs
{
    public class ReferralCreateDto
    {
        public required string Title { get; set; }
        public required DateTime IssueDate { get; set; }
        public required DateTime ExpirationDate { get; set; }
        public required string ReferralType { get; set; }
        public required string ReferralNumber { get; set; }
        public IFormFile? Document { get; set; }
    }
}
