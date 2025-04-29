using MedicalArchive.API.Application.DTOs.VaccinationDTOs;
using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;

namespace MedicalArchive.API.Application.Services
{
    public class VaccinationService : IVaccinationService
    {
        private readonly IVaccinationRepository _vaccinationRepository;
        private readonly IFileService _fileService;

        public VaccinationService(
            IVaccinationRepository vaccinationRepository,
            IFileService fileService)
        {
            _vaccinationRepository = vaccinationRepository;
            _fileService = fileService;
        }

        public async Task<VaccinationDto> GetByIdAsync(int id, int userId)
        {
            var vaccination = await _vaccinationRepository.GetByIdAsync(id);

            if (vaccination == null || vaccination.UserId != userId)
            {
                throw new Exception($"Щеплення з ID {id} не знайдено");
            }

            return MapToDto(vaccination);
        }

        public async Task<IEnumerable<VaccinationDto>> GetAllByUserIdAsync(int userId)
        {
            var vaccinations = await _vaccinationRepository.GetByUserIdAsync(userId);
            return vaccinations.Select(MapToDto);
        }

        public async Task<IEnumerable<VaccinationDto>> SearchByVaccineNameAsync(int userId, string searchTerm)
        {
            var vaccinations = await _vaccinationRepository.SearchByVaccineNameAsync(userId, searchTerm);
            return vaccinations.Select(MapToDto);
        }

        public async Task<IEnumerable<VaccinationDto>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            var vaccinations = await _vaccinationRepository.GetByDateRangeAsync(userId, startDate, endDate);
            return vaccinations.Select(MapToDto);
        }

        public async Task<VaccinationDto> CreateAsync(int userId, VaccinationCreateDto vaccinationDto)
        {
            // Завантаження файлу, якщо він є
            string filePath = string.Empty;
            if (vaccinationDto.Document != null)
            {
                filePath = await _fileService.SaveFileAsync(vaccinationDto.Document, "vaccinations", userId);
            }

            // Створення об'єкту щеплення
            var vaccination = new Vaccination
            {
                VaccineName = vaccinationDto.VaccineName,
                VaccinationDate = vaccinationDto.VaccinationDate,
                Manufacturer = vaccinationDto.Manufacturer,
                DoseNumber = vaccinationDto.DoseNumber,
                UserId = userId,
                DocumentFilePath = filePath
            };

            // Збереження в репозиторій
            var createdVaccination = await _vaccinationRepository.AddAsync(vaccination);

            return MapToDto(createdVaccination);
        }

        public async Task<VaccinationDto> UpdateAsync(int id, int userId, VaccinationUpdateDto vaccinationDto)
        {
            // Перевіряємо, чи існує щеплення
            var vaccination = await _vaccinationRepository.GetByIdAsync(id);

            if (vaccination == null || vaccination.UserId != userId)
            {
                throw new Exception($"Щеплення з ID {id} не знайдено");
            }

            // Якщо є новий файл, видаляємо старий і завантажуємо новий
            if (vaccinationDto.Document != null)
            {
                if (!string.IsNullOrEmpty(vaccination.DocumentFilePath))
                {
                    await _fileService.DeleteFileAsync(vaccination.DocumentFilePath);
                }

                vaccination.DocumentFilePath = await _fileService.SaveFileAsync(vaccinationDto.Document, "vaccinations", userId);
            }

            // Оновлюємо дані
            vaccination.VaccineName = vaccinationDto.VaccineName;
            vaccination.VaccinationDate = vaccinationDto.VaccinationDate;
            vaccination.Manufacturer = vaccinationDto.Manufacturer;
            vaccination.DoseNumber = vaccinationDto.DoseNumber;

            // Зберігаємо зміни
            await _vaccinationRepository.UpdateAsync(vaccination);

            return MapToDto(vaccination);
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            // Перевіряємо, чи існує щеплення
            var vaccination = await _vaccinationRepository.GetByIdAsync(id);

            if (vaccination == null || vaccination.UserId != userId)
            {
                throw new Exception($"Щеплення з ID {id} не знайдено");
            }

            // Видаляємо файл, якщо він є
            if (!string.IsNullOrEmpty(vaccination.DocumentFilePath))
            {
                await _fileService.DeleteFileAsync(vaccination.DocumentFilePath);
            }

            // Видаляємо щеплення
            await _vaccinationRepository.DeleteAsync(id);

            return true;
        }

        // Мапінг з доменної моделі в DTO
        private VaccinationDto MapToDto(Vaccination vaccination)
        {
            return new VaccinationDto
            {
                Id = vaccination.Id,
                VaccineName = vaccination.VaccineName,
                VaccinationDate = vaccination.VaccinationDate,
                Manufacturer = vaccination.Manufacturer,
                DoseNumber = vaccination.DoseNumber,
                UserId = vaccination.UserId,
                DocumentFilePath = vaccination.DocumentFilePath
            };
        }
    }
}
