using MedicalArchive.API.Domain.Entities;

namespace MedicalArchive.API.Domain.Interfaces
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<bool> ExistsByEmailAsync(string email);
        Task<IEnumerable<User>> GetDoctorsWithAccessToUserAsync(int userId);
        Task<IEnumerable<User>> GetUsersByDoctorAccessAsync(int doctorId);
    }
}
