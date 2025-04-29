using MedicalArchive.API.Application.DTOs.ReferralDTOs;
using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;

namespace MedicalArchive.API.Application.Services
{
    public class ReferralService : IReferralService
    {
        private readonly IReferralRepository _referralRepository;
        private readonly IFileService _fileService;

        public ReferralService(
            IReferralRepository referralRepository,
            IFileService fileService)
        {
            _referralRepository = referralRepository;
            _fileService = fileService;
        }

        public async Task<ReferralDto> GetByIdAsync(int id, int userId)
        {
            var referral = await _referralRepository.GetByIdAsync(id);

            if (referral == null || referral.UserId != userId)
            {
                throw new Exception($"Направлення з ID {id} не знайдено");
            }

            return MapToDto(referral);
        }

        public async Task<IEnumerable<ReferralDto>> GetAllByUserIdAsync(int userId)
        {
            var referrals = await _referralRepository.GetByUserIdAsync(userId);
            return referrals.Select(MapToDto);
        }

        public async Task<IEnumerable<ReferralDto>> SearchByTitleAsync(int userId, string searchTerm)
        {
            var referrals = await _referralRepository.SearchByTitleAsync(userId, searchTerm);
            return referrals.Select(MapToDto);
        }

        public async Task<IEnumerable<ReferralDto>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            var referrals = await _referralRepository.GetByDateRangeAsync(userId, startDate, endDate);
            return referrals.Select(MapToDto);
        }

        public async Task<ReferralDto> CreateAsync(int userId, ReferralCreateDto referralDto)
        {
            // Завантаження файлу, якщо він є
            string filePath = string.Empty;
            if (referralDto.Document != null)
            {
                filePath = await _fileService.SaveFileAsync(referralDto.Document, "referrals", userId);
            }

            // Створення об'єкту направлення
            var referral = new Referral
            {
                Title = referralDto.Title,
                IssueDate = referralDto.IssueDate,
                ExpirationDate = referralDto.ExpirationDate,
                ReferralType = referralDto.ReferralType,
                ReferralNumber = referralDto.ReferralNumber,
                UserId = userId,
                DocumentFilePath = filePath
            };

            // Збереження в репозиторій
            var createdReferral = await _referralRepository.AddAsync(referral);

            return MapToDto(createdReferral);
        }

        public async Task<ReferralDto> UpdateAsync(int id, int userId, ReferralUpdateDto referralDto)
        {
            // Перевіряємо, чи існує направлення
            var referral = await _referralRepository.GetByIdAsync(id);

            if (referral == null || referral.UserId != userId)
            {
                throw new Exception($"Направлення з ID {id} не знайдено");
            }

            // Якщо є новий файл, видаляємо старий і завантажуємо новий
            if (referralDto.Document != null)
            {
                if (!string.IsNullOrEmpty(referral.DocumentFilePath))
                {
                    await _fileService.DeleteFileAsync(referral.DocumentFilePath);
                }

                referral.DocumentFilePath = await _fileService.SaveFileAsync(referralDto.Document, "referrals", userId);
            }

            // Оновлюємо дані
            referral.Title = referralDto.Title;
            referral.IssueDate = referralDto.IssueDate;
            referral.ExpirationDate = referralDto.ExpirationDate;
            referral.ReferralType = referralDto.ReferralType;
            referral.ReferralNumber = referralDto.ReferralNumber;

            // Зберігаємо зміни
            await _referralRepository.UpdateAsync(referral);

            return MapToDto(referral);
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            // Перевіряємо, чи існує направлення
            var referral = await _referralRepository.GetByIdAsync(id);

            if (referral == null || referral.UserId != userId)
            {
                throw new Exception($"Направлення з ID {id} не знайдено");
            }

            // Видаляємо файл, якщо він є
            if (!string.IsNullOrEmpty(referral.DocumentFilePath))
            {
                await _fileService.DeleteFileAsync(referral.DocumentFilePath);
            }

            // Видаляємо направлення
            await _referralRepository.DeleteAsync(id);

            return true;
        }

        // Мапінг з доменної моделі в DTO
        private ReferralDto MapToDto(Referral referral)
        {
            return new ReferralDto
            {
                Id = referral.Id,
                Title = referral.Title,
                IssueDate = referral.IssueDate,
                ExpirationDate = referral.ExpirationDate,
                ReferralType = referral.ReferralType,
                ReferralNumber = referral.ReferralNumber,
                UserId = referral.UserId,
                DocumentFilePath = referral.DocumentFilePath
            };
        }
    }
}
