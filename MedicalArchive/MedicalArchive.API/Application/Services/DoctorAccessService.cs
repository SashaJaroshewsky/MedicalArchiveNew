using MedicalArchive.API.Application.DTOs.DoctorAccessDTOs;
using MedicalArchive.API.Application.DTOs.UserDTOs;
using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;

namespace MedicalArchive.API.Application.Services
{
    public class DoctorAccessService : IDoctorAccessService
    {
        private readonly IDoctorAccessRepository _doctorAccessRepository;
        private readonly IUserRepository _userRepository;

        public DoctorAccessService(IDoctorAccessRepository doctorAccessRepository, IUserRepository userRepository)
        {
            _doctorAccessRepository = doctorAccessRepository;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<UserDto>> GetDoctorsWithAccessToUserAsync(int userId)
        {
            var doctors = await _userRepository.GetDoctorsWithAccessToUserAsync(userId);
            return doctors.Select(MapToUserDto);
        }

        public async Task<IEnumerable<UserDto>> GetUsersByDoctorAccessAsync(int doctorId)
        {
            var users = await _userRepository.GetUsersByDoctorAccessAsync(doctorId);
            return users.Select(MapToUserDto);
        }

        public async Task<DoctorAccessDto> GrantAccessAsync(int userId, DoctorAccessCreateDto accessDto)
        {
            // Перевіряємо, чи існує користувач
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception($"Користувача з ID {userId} не знайдено");
            }

            // Знаходимо лікаря за email
            var doctor = await _userRepository.GetByEmailAsync(accessDto.DoctorEmail);
            if (doctor == null)
            {
                throw new Exception($"Лікаря з email {accessDto.DoctorEmail} не знайдено");
            }

            // Перевіряємо, чи є цей користувач лікарем
            if (doctor.Role != "Doctor")
            {
                throw new Exception($"Користувач з email {accessDto.DoctorEmail} не є лікарем");
            }

            // Перевіряємо, чи вже є доступ у цього лікаря
            var existingAccess = await _doctorAccessRepository.ExistsAccessAsync(userId, doctor.Id);
            if (existingAccess)
            {
                throw new Exception($"Лікар з email {accessDto.DoctorEmail} вже має доступ до ваших даних");
            }

            // Надаємо доступ
            var doctorAccess = new DoctorAccess
            {
                UserId = userId,
                DoctorId = doctor.Id,
                GrantedDate = DateTime.UtcNow
            };

            var createdAccess = await _doctorAccessRepository.AddAsync(doctorAccess);

            return new DoctorAccessDto
            {
                Id = createdAccess.Id,
                UserId = createdAccess.UserId,
                DoctorId = createdAccess.DoctorId,
                GrantedDate = createdAccess.GrantedDate,
                User = MapToUserDto(user),
                Doctor = MapToUserDto(doctor)
            };
        }

        public async Task<bool> RevokeAccessAsync(int userId, int doctorId)
        {
            // Перевіряємо, чи існує доступ
            var existingAccess = await _doctorAccessRepository.ExistsAccessAsync(userId, doctorId);
            if (!existingAccess)
            {
                throw new Exception($"Доступ лікаря з ID {doctorId} до користувача з ID {userId} не знайдено");
            }

            // Відкликаємо доступ
            await _doctorAccessRepository.RemoveAccessAsync(userId, doctorId);

            return true;
        }

        public async Task<bool> HasAccessAsync(int userId, int doctorId)
        {
            return await _doctorAccessRepository.ExistsAccessAsync(userId, doctorId);
        }

        // Мапінг з доменної моделі в DTO
        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                MiddleName = user.MiddleName,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                Role = user.Role
            };
        }
    }
}
