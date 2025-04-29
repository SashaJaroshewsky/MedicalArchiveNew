using MedicalArchive.API.Domain.Entities;

namespace MedicalArchive.API.Domain.Interfaces
{
    public interface IPrescriptionRepository : IRepositoryBase<Prescription>
    {
        Task<IEnumerable<Prescription>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Prescription>> SearchByMedicationNameAsync(int userId, string searchTerm);
        Task<IEnumerable<Prescription>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
    }
}
