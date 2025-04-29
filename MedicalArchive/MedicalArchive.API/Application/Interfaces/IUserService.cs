using MedicalArchive.API.Application.DTOs.UserDTOs;

namespace MedicalArchive.API.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> GetByIdAsync(int id);
        Task<UserDto> GetByEmailAsync(string email);
        Task<UserDto> UpdateUserAsync(int id, UserUpdateDto userDto);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> ChangePasswordAsync(int id, string currentPassword, string newPassword);
    }
}
