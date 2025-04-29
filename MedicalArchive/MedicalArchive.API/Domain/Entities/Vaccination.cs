namespace MedicalArchive.API.Domain.Entities
{
    public class Vaccination
    {
        public int Id { get; set; }
        public required string VaccineName { get; set; }
        public required DateTime VaccinationDate { get; set; }
        public required string Manufacturer { get; set; }
        public required string DoseNumber { get; set; }
        public int UserId { get; set; }
        public string? DocumentFilePath { get; set; }

        // Навігаційні властивості
        public virtual User? User { get; set; }
    }
}
