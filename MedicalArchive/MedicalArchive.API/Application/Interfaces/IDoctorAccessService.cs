using MedicalArchive.API.Application.DTOs.DoctorAccessDTOs;
using MedicalArchive.API.Application.DTOs.UserDTOs;

namespace MedicalArchive.API.Application.Interfaces
{
    public interface IDoctorAccessService
    {
        Task<IEnumerable<UserDto>> GetDoctorsWithAccessToUserAsync(int userId);
        Task<IEnumerable<UserDto>> GetUsersByDoctorAccessAsync(int doctorId);
        Task<DoctorAccessDto> GrantAccessAsync(int userId, DoctorAccessCreateDto accessDto);
        Task<bool> RevokeAccessAsync(int userId, int doctorId);
        Task<bool> HasAccessAsync(int userId, int doctorId);
    }
}
