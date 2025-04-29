namespace MedicalArchive.API.Domain.Entities
{
    public class Prescription
    {
        public int Id { get; set; }
        public required string MedicationName { get; set; }
        public required DateTime IssueDate { get; set; }
        public required string Dosage { get; set; }
        public required string Instructions { get; set; }
        public int UserId { get; set; }
        public string? DocumentFilePath { get; set; }

        // Навігаційні властивості
        public virtual User? User { get; set; }
    }
}
