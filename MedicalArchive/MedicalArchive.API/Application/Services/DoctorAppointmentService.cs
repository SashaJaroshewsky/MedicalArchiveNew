using MedicalArchive.API.Application.DTOs.DoctorAppointmentDTOs;
using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;

namespace MedicalArchive.API.Application.Services
{
    public class DoctorAppointmentService : IDoctorAppointmentService
    {
        private readonly IDoctorAppointmentRepository _appointmentRepository;
        private readonly IFileService _fileService;

        public DoctorAppointmentService(
            IDoctorAppointmentRepository appointmentRepository,
            IFileService fileService)
        {
            _appointmentRepository = appointmentRepository;
            _fileService = fileService;
        }

        public async Task<DoctorAppointmentDto> GetByIdAsync(int id, int userId)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(id);

            if (appointment == null || appointment.UserId != userId)
            {
                throw new Exception($"Прийом у лікаря з ID {id} не знайдено");
            }

            return MapToDto(appointment);
        }

        public async Task<IEnumerable<DoctorAppointmentDto>> GetAllByUserIdAsync(int userId)
        {
            var appointments = await _appointmentRepository.GetByUserIdAsync(userId);
            return appointments.Select(MapToDto);
        }

        public async Task<IEnumerable<DoctorAppointmentDto>> SearchByTitleAsync(int userId, string searchTerm)
        {
            var appointments = await _appointmentRepository.SearchByTitleAsync(userId, searchTerm);
            return appointments.Select(MapToDto);
        }

        public async Task<IEnumerable<DoctorAppointmentDto>> GetByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            var appointments = await _appointmentRepository.GetByDateRangeAsync(userId, startDate, endDate);
            return appointments.Select(MapToDto);
        }

        public async Task<DoctorAppointmentDto> CreateAsync(int userId, DoctorAppointmentCreateDto appointmentDto)
        {
            // Завантаження файлу, якщо він є
            string filePath = string.Empty;
            if (appointmentDto.Document != null)
            {
                filePath = await _fileService.SaveFileAsync(appointmentDto.Document, "appointments", userId);
            }

            // Створення об'єкту прийому
            var appointment = new DoctorAppointment
            {
                Title = appointmentDto.Title,
                AppointmentDate = appointmentDto.AppointmentDate,
                DoctorName = appointmentDto.DoctorName,
                Complaints = appointmentDto.Complaints,
                ProcedureDescription = appointmentDto.ProcedureDescription,
                Diagnosis = appointmentDto.Diagnosis,
                UserId = userId,
                DocumentFilePath = filePath
            };

            // Збереження в репозиторій
            var createdAppointment = await _appointmentRepository.AddAsync(appointment);

            return MapToDto(createdAppointment);
        }

        public async Task<DoctorAppointmentDto> UpdateAsync(int id, int userId, DoctorAppointmentUpdateDto appointmentDto)
        {
            // Перевіряємо, чи існує прийом
            var appointment = await _appointmentRepository.GetByIdAsync(id);

            if (appointment == null || appointment.UserId != userId)
            {
                throw new Exception($"Прийом у лікаря з ID {id} не знайдено");
            }

            // Якщо є новий файл, видаляємо старий і завантажуємо новий
            if (appointmentDto.Document != null)
            {
                if (!string.IsNullOrEmpty(appointment.DocumentFilePath))
                {
                    await _fileService.DeleteFileAsync(appointment.DocumentFilePath);
                }

                appointment.DocumentFilePath = await _fileService.SaveFileAsync(appointmentDto.Document, "appointments", userId);
            }

            // Оновлюємо дані
            appointment.Title = appointmentDto.Title;
            appointment.AppointmentDate = appointmentDto.AppointmentDate;
            appointment.DoctorName = appointmentDto.DoctorName;
            appointment.Complaints = appointmentDto.Complaints;
            appointment.ProcedureDescription = appointmentDto.ProcedureDescription;
            appointment.Diagnosis = appointmentDto.Diagnosis;

            // Зберігаємо зміни
            await _appointmentRepository.UpdateAsync(appointment);

            return MapToDto(appointment);
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            // Перевіряємо, чи існує прийом
            var appointment = await _appointmentRepository.GetByIdAsync(id);

            if (appointment == null || appointment.UserId != userId)
            {
                throw new Exception($"Прийом у лікаря з ID {id} не знайдено");
            }

            // Видаляємо файл, якщо він є
            if (!string.IsNullOrEmpty(appointment.DocumentFilePath))
            {
                await _fileService.DeleteFileAsync(appointment.DocumentFilePath);
            }

            // Видаляємо прийом
            await _appointmentRepository.DeleteAsync(id);

            return true;
        }

        // Мапінг з доменної моделі в DTO
        private DoctorAppointmentDto MapToDto(DoctorAppointment appointment)
        {
            return new DoctorAppointmentDto
            {
                Id = appointment.Id,
                Title = appointment.Title,
                AppointmentDate = appointment.AppointmentDate,
                DoctorName = appointment.DoctorName,
                Complaints = appointment.Complaints,
                ProcedureDescription = appointment.ProcedureDescription,
                Diagnosis = appointment.Diagnosis,
                UserId = appointment.UserId,
                DocumentFilePath = appointment.DocumentFilePath
            };
        }
    }
}
