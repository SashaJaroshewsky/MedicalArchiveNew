using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalArchive.API.DataAccess.Repositories
{
    public class PrescriptionRepository : RepositoryBase<Prescription>, IPrescriptionRepository
    {
        public PrescriptionRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<Prescription>> GetByUserIdAsync(int userId)
        {
            return await _dbContext.Prescriptions
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.IssueDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Prescription>> SearchByMedicationNameAsync(int userId, string searchTerm)
        {
            return await _dbContext.Prescriptions
                .Where(p => p.UserId == userId && p.MedicationName.Contains(searchTerm))
                .OrderByDescending(p => p.IssueDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Prescription>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _dbContext.Prescriptions
                .Where(p => p.UserId == userId &&
                       p.IssueDate >= startDate &&
                       p.IssueDate <= endDate)
                .OrderByDescending(p => p.IssueDate)
                .ToListAsync();
        }
    }
}
