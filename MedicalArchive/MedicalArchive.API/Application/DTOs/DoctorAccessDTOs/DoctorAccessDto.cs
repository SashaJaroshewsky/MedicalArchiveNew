using MedicalArchive.API.Application.DTOs.UserDTOs;

namespace MedicalArchive.API.Application.DTOs.DoctorAccessDTOs
{
    public class DoctorAccessDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DoctorId { get; set; }
        public DateTime GrantedDate { get; set; }
        public UserDto? User { get; set; }
        public UserDto? Doctor { get; set; }
    }
}
