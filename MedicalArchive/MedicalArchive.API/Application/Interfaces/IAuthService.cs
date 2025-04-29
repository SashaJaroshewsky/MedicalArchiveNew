using MedicalArchive.API.Application.DTOs.AuthDTOs;
using MedicalArchive.API.Application.DTOs.UserDTOs;

namespace MedicalArchive.API.Application.Interfaces
{
    public interface IAuthService
    {
        Task<TokenDto> LoginAsync(UserLoginDto loginDto);
        Task<UserDto> RegisterAsync(UserRegistrationDto registrationDto);
        Task<string> GenerateJwtTokenAsync(UserDto user);
    }
}
