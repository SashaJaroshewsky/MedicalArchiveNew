using MedicalArchive.API.Application.DTOs.VaccinationDTOs;

namespace MedicalArchive.API.Application.Interfaces
{
    public interface IVaccinationService
    {
        Task<VaccinationDto> GetByIdAsync(int id, int userId);
        Task<IEnumerable<VaccinationDto>> GetAllByUserIdAsync(int userId);
        Task<IEnumerable<VaccinationDto>> SearchByVaccineNameAsync(int userId, string searchTerm);
        Task<IEnumerable<VaccinationDto>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
        Task<VaccinationDto> CreateAsync(int userId, VaccinationCreateDto vaccinationDto);
        Task<VaccinationDto> UpdateAsync(int id, int userId, VaccinationUpdateDto vaccinationDto);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
