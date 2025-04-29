using MedicalArchive.API.Domain.Entities;

namespace MedicalArchive.API.Domain.Interfaces
{
    public interface IDoctorAccessRepository : IRepositoryBase<DoctorAccess>
    {
        Task<bool> ExistsAccessAsync(int userId, int doctorId);
        Task RemoveAccessAsync(int userId, int doctorId);
    }
}
