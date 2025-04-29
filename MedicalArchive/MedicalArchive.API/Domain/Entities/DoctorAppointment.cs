namespace MedicalArchive.API.Domain.Entities
{
    public class DoctorAppointment
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required DateTime AppointmentDate { get; set; }
        public required string DoctorName { get; set; }
        public required string Complaints { get; set; }
        public required string ProcedureDescription { get; set; }
        public required string Diagnosis { get; set; }
        public int UserId { get; set; }
        public string? DocumentFilePath { get; set; }

        // Навігаційні властивості
        public virtual User? User { get; set; }
    }
}
