using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalArchive.API.DataAccess.Repositories
{
    public class DoctorAccessRepository : RepositoryBase<DoctorAccess>, IDoctorAccessRepository
    {
        public DoctorAccessRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<bool> ExistsAccessAsync(int userId, int doctorId)
        {
            return await _dbContext.DoctorAccesses.AnyAsync(da =>
                da.UserId == userId && da.DoctorId == doctorId);
        }

        public async Task RemoveAccessAsync(int userId, int doctorId)
        {
            var access = await _dbContext.DoctorAccesses.FirstOrDefaultAsync(da =>
                da.UserId == userId && da.DoctorId == doctorId);

            if (access != null)
            {
                _dbContext.DoctorAccesses.Remove(access);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
