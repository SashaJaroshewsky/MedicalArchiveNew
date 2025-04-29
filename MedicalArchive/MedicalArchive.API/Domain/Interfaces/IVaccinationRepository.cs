using MedicalArchive.API.Domain.Entities;

namespace MedicalArchive.API.Domain.Interfaces
{
    public interface IVaccinationRepository : IRepositoryBase<Vaccination>
    {
        Task<IEnumerable<Vaccination>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Vaccination>> SearchByVaccineNameAsync(int userId, string searchTerm);
        Task<IEnumerable<Vaccination>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
    }
}
