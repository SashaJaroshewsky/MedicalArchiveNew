using MedicalArchive.API.Domain.Entities;

namespace MedicalArchive.API.Domain.Interfaces
{
    public interface IReferralRepository : IRepositoryBase<Referral>
    {
        Task<IEnumerable<Referral>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Referral>> SearchByTitleAsync(int userId, string searchTerm);
        Task<IEnumerable<Referral>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
    }
}
