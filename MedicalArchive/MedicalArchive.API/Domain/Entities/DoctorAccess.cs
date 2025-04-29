namespace MedicalArchive.API.Domain.Entities
{
    public class DoctorAccess
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DoctorId { get; set; }
        public DateTime GrantedDate { get; set; }

        // Навігаційні властивості
        public virtual User? User { get; set; }
        public virtual User? Doctor { get; set; }
    }
}
