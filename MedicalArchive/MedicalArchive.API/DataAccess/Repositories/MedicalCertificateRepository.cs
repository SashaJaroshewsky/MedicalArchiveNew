using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalArchive.API.DataAccess.Repositories
{
    public class MedicalCertificateRepository : RepositoryBase<MedicalCertificate>, IMedicalCertificateRepository
    {
        public MedicalCertificateRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<MedicalCertificate>> GetByUserIdAsync(int userId)
        {
            return await _dbContext.MedicalCertificates
                .Where(mc => mc.UserId == userId)
                .OrderByDescending(mc => mc.IssueDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<MedicalCertificate>> SearchByTitleAsync(int userId, string searchTerm)
        {
            return await _dbContext.MedicalCertificates
                .Where(mc => mc.UserId == userId && mc.Title.Contains(searchTerm))
                .OrderByDescending(mc => mc.IssueDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<MedicalCertificate>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _dbContext.MedicalCertificates
                .Where(mc => mc.UserId == userId &&
                       mc.IssueDate >= startDate &&
                       mc.IssueDate <= endDate)
                .OrderByDescending(mc => mc.IssueDate)
                .ToListAsync();
        }
    }
}
