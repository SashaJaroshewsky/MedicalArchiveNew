namespace MedicalArchive.API.Application.DTOs.AuthDTOs
{
    public class TokenDto
    {
        public required string AccessToken { get; set; }
        public required string UserEmail { get; set; }
        public required string UserRole { get; set; }
        public required int UserId { get; set; }
    }
}
