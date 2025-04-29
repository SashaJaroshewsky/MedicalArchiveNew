namespace MedicalArchive.API.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string MiddleName { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public required string Gender { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Address { get; set; }
        public required string PasswordHash { get; set; }
        public required string Role { get; set; } // "User" або "Doctor"

        // Навігаційні властивості
        public virtual ICollection<DoctorAppointment>? DoctorAppointments { get; set; }
        public virtual ICollection<Prescription>? Prescriptions { get; set; }
        public virtual ICollection<Referral>? Referrals { get; set; }
        public virtual ICollection<Vaccination>? Vaccinations { get; set; }
        public virtual ICollection<MedicalCertificate>? MedicalCertificates { get; set; }

        // Доступ лікаря до архіву
        public virtual ICollection<DoctorAccess>? DoctorsWithAccess { get; set; } // Для користувачів - лікарі, які мають доступ
        public virtual ICollection<DoctorAccess>? AccessToUsers { get; set; } // Для лікарів - користувачі, до яких є доступ
    }
}
