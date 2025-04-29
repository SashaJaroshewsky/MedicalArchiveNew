using MedicalArchive.API.Application.DTOs.UserDTOs;
using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace MedicalArchive.API.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserDto> GetByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                throw new Exception($"Користувача з ID {id} не знайдено");
            }

            return MapToUserDto(user);
        }

        public async Task<UserDto> GetByEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
            {
                throw new Exception($"Користувача з email {email} не знайдено");
            }

            return MapToUserDto(user);
        }

        public async Task<UserDto> UpdateUserAsync(int id, UserUpdateDto userDto)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                throw new Exception($"Користувача з ID {id} не знайдено");
            }

            // Оновлюємо дані користувача
            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.MiddleName = userDto.MiddleName;
            user.DateOfBirth = userDto.DateOfBirth;
            user.Gender = userDto.Gender;
            user.PhoneNumber = userDto.PhoneNumber;
            user.Address = userDto.Address;

            await _userRepository.UpdateAsync(user);

            return MapToUserDto(user);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                throw new Exception($"Користувача з ID {id} не знайдено");
            }

            await _userRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> ChangePasswordAsync(int id, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                throw new Exception($"Користувача з ID {id} не знайдено");
            }

            // Перевіряємо поточний пароль
            if (!VerifyPasswordHash(currentPassword, user.PasswordHash))
            {
                throw new Exception("Поточний пароль невірний");
            }

            // Оновлюємо пароль
            user.PasswordHash = HashPassword(newPassword);
            await _userRepository.UpdateAsync(user);

            return true;
        }

        // Допоміжні методи для роботи з паролями
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        private bool VerifyPasswordHash(string password, string hash)
        {
            var passwordHash = HashPassword(password);
            return passwordHash == hash;
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
