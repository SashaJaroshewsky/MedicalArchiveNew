using MedicalArchive.API.Application.DTOs.PrescriptionDTOs;

namespace MedicalArchive.API.Application.Interfaces
{
    public interface IPrescriptionService
    {
        Task<PrescriptionDto> GetByIdAsync(int id, int userId);
        Task<IEnumerable<PrescriptionDto>> GetAllByUserIdAsync(int userId);
        Task<IEnumerable<PrescriptionDto>> SearchByMedicationNameAsync(int userId, string searchTerm);
        Task<IEnumerable<PrescriptionDto>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
        Task<PrescriptionDto> CreateAsync(int userId, PrescriptionCreateDto prescriptionDto);
        Task<PrescriptionDto> UpdateAsync(int id, int userId, PrescriptionUpdateDto prescriptionDto);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
