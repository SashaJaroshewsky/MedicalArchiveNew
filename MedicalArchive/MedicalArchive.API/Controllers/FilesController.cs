using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedicalArchive.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly string _uploadsPath;
        private readonly IDoctorAccessService _doctorAccessService;

        public FilesController(IDoctorAccessService doctorAccessService)
        {
            _uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            _doctorAccessService = doctorAccessService;
        }

        [HttpGet("{userId}/{*filePath}")]
        public async Task<IActionResult> GetFile(int userId, string filePath)
        {
            try
            {
                // Перевірка доступу - якщо користувач запитує власний файл або є лікарем з доступом
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var isDoctor = User.IsInRole("Doctor");

                // Перевіряємо права доступу
                if (currentUserId != userId)
                {
                    // Якщо поточний користувач - не той, чий файл запитується
                    if (isDoctor)
                    {
                        // Якщо користувач - лікар, перевіряємо, чи має він доступ до пацієнта
                        var hasAccess = await _doctorAccessService.HasAccessAsync(userId, currentUserId);
                        if (!hasAccess)
                        {
                            return Forbid();
                        }
                    }
                    else
                    {
                        // Якщо звичайний користувач запитує чужий файл
                        return Forbid();
                    }
                }

                // Будуємо повний шлях до файлу
                var fullPath = Path.Combine(_uploadsPath, filePath);

                // Перевіряємо існування файлу
                if (!System.IO.File.Exists(fullPath))
                {
                    return NotFound();
                }

                // Визначення MIME-типу на основі розширення файлу
                var extension = Path.GetExtension(fullPath).ToLowerInvariant();
                string contentType = GetContentType(extension);

                // Повертаємо файл
                var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
                return File(fileStream, contentType);
            }
            catch (Exception ex)
            {
                // Логування помилки
                return BadRequest(ex.Message);
            }
        }

        private string GetContentType(string extension)
        {
            switch (extension)
            {
                case ".pdf":
                    return "application/pdf";
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".png":
                    return "image/png";
                case ".gif":
                    return "image/gif";
                case ".doc":
                    return "application/msword";
                case ".docx":
                    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                case ".xls":
                    return "application/vnd.ms-excel";
                case ".xlsx":
                    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                default:
                    return "application/octet-stream";
            }
        }
    }
}
