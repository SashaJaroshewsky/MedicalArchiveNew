namespace MedicalArchive.API.Application.DTOs.VaccinationDTOs
{
    public class VaccinationUpdateDto
    {
        public required string VaccineName { get; set; }
        public required DateTime VaccinationDate { get; set; }
        public required string Manufacturer { get; set; }
        public required string DoseNumber { get; set; }
        public IFormFile? Document { get; set; }
    }
}
