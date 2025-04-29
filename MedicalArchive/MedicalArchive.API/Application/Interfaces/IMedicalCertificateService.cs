using MedicalArchive.API.Application.DTOs.MedicalCertificateDTOs;

namespace MedicalArchive.API.Application.Interfaces
{
    public interface IMedicalCertificateService
    {
        Task<MedicalCertificateDto> GetByIdAsync(int id, int userId);
        Task<IEnumerable<MedicalCertificateDto>> GetAllByUserIdAsync(int userId);
        Task<IEnumerable<MedicalCertificateDto>> SearchByTitleAsync(int userId, string searchTerm);
        Task<IEnumerable<MedicalCertificateDto>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
        Task<MedicalCertificateDto> CreateAsync(int userId, MedicalCertificateCreateDto certificateDto);
        Task<MedicalCertificateDto> UpdateAsync(int id, int userId, MedicalCertificateUpdateDto certificateDto);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
