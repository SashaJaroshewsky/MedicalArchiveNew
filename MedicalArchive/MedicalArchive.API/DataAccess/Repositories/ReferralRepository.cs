using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalArchive.API.DataAccess.Repositories
{
    public class ReferralRepository : RepositoryBase<Referral>, IReferralRepository
    {
        public ReferralRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<Referral>> GetByUserIdAsync(int userId)
        {
            return await _dbContext.Referrals
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.IssueDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Referral>> SearchByTitleAsync(int userId, string searchTerm)
        {
            return await _dbContext.Referrals
                .Where(r => r.UserId == userId && r.Title.Contains(searchTerm))
                .OrderByDescending(r => r.IssueDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Referral>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _dbContext.Referrals
                .Where(r => r.UserId == userId &&
                       r.IssueDate >= startDate &&
                       r.IssueDate <= endDate)
                .OrderByDescending(r => r.IssueDate)
                .ToListAsync();
        }
    }
}
