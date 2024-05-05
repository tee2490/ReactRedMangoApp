using Microsoft.AspNetCore.Identity;

namespace API_RedMango.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
    }
}
