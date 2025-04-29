using MedicalArchive.API.Application.DTOs.PrescriptionDTOs;
using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;

namespace MedicalArchive.API.Application.Services
{
    public class PrescriptionService : IPrescriptionService
    {
        private readonly IPrescriptionRepository _prescriptionRepository;
        private readonly IFileService _fileService;

        public PrescriptionService(
            IPrescriptionRepository prescriptionRepository,
            IFileService fileService)
        {
            _prescriptionRepository = prescriptionRepository;
            _fileService = fileService;
        }

        public async Task<PrescriptionDto> GetByIdAsync(int id, int userId)
        {
            var prescription = await _prescriptionRepository.GetByIdAsync(id);

            if (prescription == null || prescription.UserId != userId)
            {
                throw new Exception($"Рецепт з ID {id} не знайдено");
            }

            return MapToDto(prescription);
        }

        public async Task<IEnumerable<PrescriptionDto>> GetAllByUserIdAsync(int userId)
        {
            var prescriptions = await _prescriptionRepository.GetByUserIdAsync(userId);
            return prescriptions.Select(MapToDto);
        }

        public async Task<IEnumerable<PrescriptionDto>> SearchByMedicationNameAsync(int userId, string searchTerm)
        {
            var prescriptions = await _prescriptionRepository.SearchByMedicationNameAsync(userId, searchTerm);
            return prescriptions.Select(MapToDto);
        }

        public async Task<IEnumerable<PrescriptionDto>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            var prescriptions = await _prescriptionRepository.GetByDateRangeAsync(userId, startDate, endDate);
            return prescriptions.Select(MapToDto);
        }

        public async Task<PrescriptionDto> CreateAsync(int userId, PrescriptionCreateDto prescriptionDto)
        {
            // Завантаження файлу, якщо він є
            string filePath = string.Empty;
            if (prescriptionDto.Document != null)
            {
                filePath = await _fileService.SaveFileAsync(prescriptionDto.Document, "prescriptions", userId);
            }

            // Створення об'єкту рецепту
            var prescription = new Prescription
            {
                MedicationName = prescriptionDto.MedicationName,
                IssueDate = prescriptionDto.IssueDate,
                Dosage = prescriptionDto.Dosage,
                Instructions = prescriptionDto.Instructions,
                UserId = userId,
                DocumentFilePath = filePath
            };

            // Збереження в репозиторій
            var createdPrescription = await _prescriptionRepository.AddAsync(prescription);

            return MapToDto(createdPrescription);
        }

        public async Task<PrescriptionDto> UpdateAsync(int id, int userId, PrescriptionUpdateDto prescriptionDto)
        {
            // Перевіряємо, чи існує рецепт
            var prescription = await _prescriptionRepository.GetByIdAsync(id);

            if (prescription == null || prescription.UserId != userId)
            {
                throw new Exception($"Рецепт з ID {id} не знайдено");
            }

            // Якщо є новий файл, видаляємо старий і завантажуємо новий
            if (prescriptionDto.Document != null)
            {
                if (!string.IsNullOrEmpty(prescription.DocumentFilePath))
                {
                    await _fileService.DeleteFileAsync(prescription.DocumentFilePath);
                }

                prescription.DocumentFilePath = await _fileService.SaveFileAsync(prescriptionDto.Document, "prescriptions", userId);
            }

            // Оновлюємо дані
            prescription.MedicationName = prescriptionDto.MedicationName;
            prescription.IssueDate = prescriptionDto.IssueDate;
            prescription.Dosage = prescriptionDto.Dosage;
            prescription.Instructions = prescriptionDto.Instructions;

            // Зберігаємо зміни
            await _prescriptionRepository.UpdateAsync(prescription);

            return MapToDto(prescription);
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            // Перевіряємо, чи існує рецепт
            var prescription = await _prescriptionRepository.GetByIdAsync(id);

            if (prescription == null || prescription.UserId != userId)
            {
                throw new Exception($"Рецепт з ID {id} не знайдено");
            }

            // Видаляємо файл, якщо він є
            if (!string.IsNullOrEmpty(prescription.DocumentFilePath))
            {
                await _fileService.DeleteFileAsync(prescription.DocumentFilePath);
            }

            // Видаляємо рецепт
            await _prescriptionRepository.DeleteAsync(id);

            return true;
        }

        // Мапінг з доменної моделі в DTO
        private PrescriptionDto MapToDto(Prescription prescription)
        {
            return new PrescriptionDto
            {
                Id = prescription.Id,
                MedicationName = prescription.MedicationName,
                IssueDate = prescription.IssueDate,
                Dosage = prescription.Dosage,
                Instructions = prescription.Instructions,
                UserId = prescription.UserId,
                DocumentFilePath = prescription.DocumentFilePath
            };
        }
    }
}
