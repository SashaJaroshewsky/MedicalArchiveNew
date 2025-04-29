namespace MedicalArchive.API.Application.DTOs.DoctorAppointmentDTOs
{
    public class DoctorAppointmentUpdateDto
    {
        public required string Title { get; set; }
        public required DateTime AppointmentDate { get; set; }
        public required string DoctorName { get; set; }
        public required string Complaints { get; set; }
        public required string ProcedureDescription { get; set; }
        public required string Diagnosis { get; set; }
        public IFormFile? Document { get; set; }
    }
}
