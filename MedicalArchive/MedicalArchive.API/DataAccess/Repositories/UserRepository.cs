using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalArchive.API.DataAccess.Repositories
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _dbContext.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<User>> GetDoctorsWithAccessToUserAsync(int userId)
        {
            return await _dbContext.DoctorAccesses
                .Where(da => da.UserId == userId)
                .Select(da => da.Doctor!)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetUsersByDoctorAccessAsync(int doctorId)
        {
            return await _dbContext.DoctorAccesses
                .Where(da => da.DoctorId == doctorId)
                .Select(da => da.User!)
                .ToListAsync();
        }
    }
}
