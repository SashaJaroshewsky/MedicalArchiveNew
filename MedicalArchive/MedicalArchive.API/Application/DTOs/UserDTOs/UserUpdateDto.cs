namespace MedicalArchive.API.Application.DTOs.UserDTOs
{
    public class UserUpdateDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string MiddleName { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public required string Gender { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Address { get; set; }
    }
}
