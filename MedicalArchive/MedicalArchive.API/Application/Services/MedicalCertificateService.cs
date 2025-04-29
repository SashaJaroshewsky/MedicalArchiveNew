using MedicalArchive.API.Application.DTOs.MedicalCertificateDTOs;
using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;

namespace MedicalArchive.API.Application.Services
{
    public class MedicalCertificateService : IMedicalCertificateService
    {
        private readonly IMedicalCertificateRepository _certificateRepository;
        private readonly IFileService _fileService;

        public MedicalCertificateService(
            IMedicalCertificateRepository certificateRepository,
            IFileService fileService)
        {
            _certificateRepository = certificateRepository;
            _fileService = fileService;
        }

        public async Task<MedicalCertificateDto> GetByIdAsync(int id, int userId)
        {
            var certificate = await _certificateRepository.GetByIdAsync(id);

            if (certificate == null || certificate.UserId != userId)
            {
                throw new Exception($"Медичну довідку з ID {id} не знайдено");
            }

            return MapToDto(certificate);
        }

        public async Task<IEnumerable<MedicalCertificateDto>> GetAllByUserIdAsync(int userId)
        {
            var certificates = await _certificateRepository.GetByUserIdAsync(userId);
            return certificates.Select(MapToDto);
        }

        public async Task<IEnumerable<MedicalCertificateDto>> SearchByTitleAsync(int userId, string searchTerm)
        {
            var certificates = await _certificateRepository.SearchByTitleAsync(userId, searchTerm);
            return certificates.Select(MapToDto);
        }

        public async Task<IEnumerable<MedicalCertificateDto>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            var certificates = await _certificateRepository.GetByDateRangeAsync(userId, startDate, endDate);
            return certificates.Select(MapToDto);
        }

        public async Task<MedicalCertificateDto> CreateAsync(int userId, MedicalCertificateCreateDto certificateDto)
        {
            // Завантаження файлу, якщо він є
            string filePath = string.Empty;
            if (certificateDto.Document != null)
            {
                filePath = await _fileService.SaveFileAsync(certificateDto.Document, "certificates", userId);
            }

            // Створення об'єкту медичної довідки
            var certificate = new MedicalCertificate
            {
                Title = certificateDto.Title,
                IssueDate = certificateDto.IssueDate,
                Description = certificateDto.Description,
                UserId = userId,
                DocumentFilePath = filePath
            };

            // Збереження в репозиторій
            var createdCertificate = await _certificateRepository.AddAsync(certificate);

            return MapToDto(createdCertificate);
        }

        public async Task<MedicalCertificateDto> UpdateAsync(int id, int userId, MedicalCertificateUpdateDto certificateDto)
        {
            // Перевіряємо, чи існує медична довідка
            var certificate = await _certificateRepository.GetByIdAsync(id);

            if (certificate == null || certificate.UserId != userId)
            {
                throw new Exception($"Медичну довідку з ID {id} не знайдено");
            }

            // Якщо є новий файл, видаляємо старий і завантажуємо новий
            if (certificateDto.Document != null)
            {
                if (!string.IsNullOrEmpty(certificate.DocumentFilePath))
                {
                    await _fileService.DeleteFileAsync(certificate.DocumentFilePath);
                }

                certificate.DocumentFilePath = await _fileService.SaveFileAsync(certificateDto.Document, "certificates", userId);
            }

            // Оновлюємо дані
            certificate.Title = certificateDto.Title;
            certificate.IssueDate = certificateDto.IssueDate;
            certificate.Description = certificateDto.Description;

            // Зберігаємо зміни
            await _certificateRepository.UpdateAsync(certificate);

            return MapToDto(certificate);
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            // Перевіряємо, чи існує медична довідка
            var certificate = await _certificateRepository.GetByIdAsync(id);

            if (certificate == null || certificate.UserId != userId)
            {
                throw new Exception($"Медичну довідку з ID {id} не знайдено");
            }

            // Видаляємо файл, якщо він є
            if (!string.IsNullOrEmpty(certificate.DocumentFilePath))
            {
                await _fileService.DeleteFileAsync(certificate.DocumentFilePath);
            }

            // Видаляємо довідку
            await _certificateRepository.DeleteAsync(id);

            return true;
        }

        // Мапінг з доменної моделі в DTO
        private MedicalCertificateDto MapToDto(MedicalCertificate certificate)
        {
            return new MedicalCertificateDto
            {
                Id = certificate.Id,
                Title = certificate.Title,
                IssueDate = certificate.IssueDate,
                Description = certificate.Description,
                UserId = certificate.UserId,
                DocumentFilePath = certificate.DocumentFilePath
            };
        }
    }
}
