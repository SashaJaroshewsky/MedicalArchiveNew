using MedicalArchive.API.Application.DTOs.AuthDTOs;
using MedicalArchive.API.Application.DTOs.UserDTOs;
using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Domain.Entities;
using MedicalArchive.API.Domain.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MedicalArchive.API.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<TokenDto> LoginAsync(UserLoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);

            if (user == null)
            {
                throw new Exception("Користувача з такою електронною адресою не знайдено");
            }

            // Перевіряємо пароль
            if (!VerifyPasswordHash(loginDto.Password, user.PasswordHash))
            {
                throw new Exception("Невірний пароль");
            }

            // Генеруємо JWT токен
            var token = await GenerateJwtTokenAsync(MapToUserDto(user));

            return new TokenDto
            {
                AccessToken = token,
                UserEmail = user.Email,
                UserRole = user.Role,
                UserId = user.Id
            };
        }

        public async Task<UserDto> RegisterAsync(UserRegistrationDto registrationDto)
        {
            // Перевіряємо, чи існує користувач з таким email
            var existingUser = await _userRepository.ExistsByEmailAsync(registrationDto.Email);

            if (existingUser)
            {
                throw new Exception("Користувач з такою електронною адресою вже існує");
            }

            // Створюємо хеш пароля
            var passwordHash = HashPassword(registrationDto.Password);

            // Створюємо нового користувача
            var user = new User
            {
                FirstName = registrationDto.FirstName,
                LastName = registrationDto.LastName,
                MiddleName = registrationDto.MiddleName,
                DateOfBirth = registrationDto.DateOfBirth,
                Gender = registrationDto.Gender,
                Email = registrationDto.Email,
                PhoneNumber = registrationDto.PhoneNumber,
                Address = registrationDto.Address,
                PasswordHash = passwordHash,
                Role = registrationDto.Role
            };

            // Зберігаємо користувача
            await _userRepository.AddAsync(user);

            return MapToUserDto(user);
        }

        public async Task<string> GenerateJwtTokenAsync(UserDto user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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
