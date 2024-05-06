namespace API_RedMango.Service.IService
{
    public interface IFileUpload
    {
        Task<string> UploadFile(IFormFile file);
        bool DeleteFile(string filePath);
    }
}
