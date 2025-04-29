using MedicalArchive.API.Domain.Entities;

namespace MedicalArchive.API.Domain.Interfaces
{
    public interface IMedicalCertificateRepository : IRepositoryBase<MedicalCertificate>
    {
        Task<IEnumerable<MedicalCertificate>> GetByUserIdAsync(int userId);
        Task<IEnumerable<MedicalCertificate>> SearchByTitleAsync(int userId, string searchTerm);
        Task<IEnumerable<MedicalCertificate>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
    }
}
