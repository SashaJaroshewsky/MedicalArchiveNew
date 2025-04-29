using MedicalArchive.API.Application.Interfaces;

namespace MedicalArchive.API.Application.Services
{
    public class FileService : IFileService
    {
        private readonly string _uploadsBasePath;

        public FileService(string uploadsBasePath)
        {
            _uploadsBasePath = uploadsBasePath;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string entityType, int userId)
        {
            if (file == null || file.Length == 0)
            {
                return string.Empty;
            }

            // Створюємо директорію для файлів, якщо вона не існує
            var userDirectory = Path.Combine(_uploadsBasePath, userId.ToString(), entityType);
            Directory.CreateDirectory(userDirectory);

            // Генеруємо унікальне ім'я файлу
            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(userDirectory, fileName);

            // Зберігаємо файл
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Повертаємо відносний шлях до файлу для збереження в БД
            return Path.Combine(userId.ToString(), entityType, fileName).Replace("\\", "/");
        }

        public Task DeleteFileAsync(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return Task.CompletedTask;
            }

            // Отримуємо повний шлях до файлу
            var fullPath = Path.Combine(_uploadsBasePath, filePath);

            // Перевіряємо, чи файл існує
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            return Task.CompletedTask;
        }
    }
}
