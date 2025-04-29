namespace MedicalArchive.API.Application.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string entityType, int userId);
        Task DeleteFileAsync(string filePath);
    }
}
