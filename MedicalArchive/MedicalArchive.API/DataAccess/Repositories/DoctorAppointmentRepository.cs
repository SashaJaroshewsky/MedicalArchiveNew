using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedicalArchive.API.DataAccess.Repositories
{
    public class DoctorAppointmentRepository : RepositoryBase<DoctorAppointment>, IDoctorAppointmentRepository
    {
        public DoctorAppointmentRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<DoctorAppointment>> GetByUserIdAsync(int userId)
        {
            return await _dbContext.DoctorAppointments
                .Where(da => da.UserId == userId)
                .OrderByDescending(da => da.AppointmentDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<DoctorAppointment>> SearchByTitleAsync(int userId, string searchTerm)
        {
            return await _dbContext.DoctorAppointments
                .Where(da => da.UserId == userId && da.Title.Contains(searchTerm))
                .OrderByDescending(da => da.AppointmentDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<DoctorAppointment>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _dbContext.DoctorAppointments
                .Where(da => da.UserId == userId &&
                       da.AppointmentDate >= startDate &&
                       da.AppointmentDate <= endDate)
                .OrderByDescending(da => da.AppointmentDate)
                .ToListAsync();
        }
    }
}
