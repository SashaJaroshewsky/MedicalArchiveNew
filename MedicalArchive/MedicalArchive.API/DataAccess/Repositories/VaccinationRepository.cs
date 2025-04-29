using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalArchive.API.DataAccess.Repositories
{
    public class VaccinationRepository : RepositoryBase<Vaccination>, IVaccinationRepository
    {
        public VaccinationRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<Vaccination>> GetByUserIdAsync(int userId)
        {
            return await _dbContext.Vaccinations
                .Where(v => v.UserId == userId)
                .OrderByDescending(v => v.VaccinationDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Vaccination>> SearchByVaccineNameAsync(int userId, string searchTerm)
        {
            return await _dbContext.Vaccinations
                .Where(v => v.UserId == userId && v.VaccineName.Contains(searchTerm))
                .OrderByDescending(v => v.VaccinationDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Vaccination>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _dbContext.Vaccinations
                .Where(v => v.UserId == userId &&
                       v.VaccinationDate >= startDate &&
                       v.VaccinationDate <= endDate)
                .OrderByDescending(v => v.VaccinationDate)
                .ToListAsync();
        }
    }
}
