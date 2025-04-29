namespace MedicalArchive.API.Application.DTOs.ReferralDTOs
{
    public class ReferralDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required DateTime IssueDate { get; set; }
        public required DateTime ExpirationDate { get; set; }
        public required string ReferralType { get; set; }
        public required string ReferralNumber { get; set; }
        public int UserId { get; set; }
        public string? DocumentFilePath { get; set; }
    }
}
