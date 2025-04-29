namespace MedicalArchive.API.Application.DTOs.PrescriptionDTOs
{
    public class PrescriptionDto
    {
        public int Id { get; set; }
        public required string MedicationName { get; set; }
        public required DateTime IssueDate { get; set; }
        public required string Dosage { get; set; }
        public required string Instructions { get; set; }
        public int UserId { get; set; }
        public string? DocumentFilePath { get; set; }
    }
}
