using MedicalArchive.API.Domain.Entities;

namespace MedicalArchive.API.Domain.Interfaces
{
    public interface IDoctorAppointmentRepository : IRepositoryBase<DoctorAppointment>
    {
        Task<IEnumerable<DoctorAppointment>> GetByUserIdAsync(int userId);
        Task<IEnumerable<DoctorAppointment>> SearchByTitleAsync(int userId, string searchTerm);
        Task<IEnumerable<DoctorAppointment>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
    }
}
