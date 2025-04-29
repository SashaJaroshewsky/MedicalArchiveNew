namespace MedicalArchive.API.Application.DTOs.PrescriptionDTOs
{
    public class PrescriptionCreateDto
    {
        public required string MedicationName { get; set; }
        public required DateTime IssueDate { get; set; }
        public required string Dosage { get; set; }
        public required string Instructions { get; set; }
        public IFormFile? Document { get; set; }
    }
}
