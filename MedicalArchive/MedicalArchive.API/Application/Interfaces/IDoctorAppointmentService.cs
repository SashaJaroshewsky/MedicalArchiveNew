using MedicalArchive.API.Application.DTOs.DoctorAppointmentDTOs;

namespace MedicalArchive.API.Application.Interfaces
{
    public interface IDoctorAppointmentService
    {
        Task<DoctorAppointmentDto> GetByIdAsync(int id, int userId);
        Task<IEnumerable<DoctorAppointmentDto>> GetAllByUserIdAsync(int userId);
        Task<IEnumerable<DoctorAppointmentDto>> SearchByTitleAsync(int userId, string searchTerm);
        Task<IEnumerable<DoctorAppointmentDto>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
        Task<DoctorAppointmentDto> CreateAsync(int userId, DoctorAppointmentCreateDto appointmentDto);
        Task<DoctorAppointmentDto> UpdateAsync(int id, int userId, DoctorAppointmentUpdateDto appointmentDto);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
