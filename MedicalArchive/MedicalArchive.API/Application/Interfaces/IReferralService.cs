using MedicalArchive.API.Application.DTOs.ReferralDTOs;

namespace MedicalArchive.API.Application.Interfaces
{
    public interface IReferralService
    {
        Task<ReferralDto> GetByIdAsync(int id, int userId);
        Task<IEnumerable<ReferralDto>> GetAllByUserIdAsync(int userId);
        Task<IEnumerable<ReferralDto>> SearchByTitleAsync(int userId, string searchTerm);
        Task<IEnumerable<ReferralDto>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
        Task<ReferralDto> CreateAsync(int userId, ReferralCreateDto referralDto);
        Task<ReferralDto> UpdateAsync(int id, int userId, ReferralUpdateDto referralDto);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
