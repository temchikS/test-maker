using System.ComponentModel.DataAnnotations;

namespace WebApplication2.Models
{
    public class User : BaseEntity
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public int Age { get; set; }
        public string Role { get; set; }
    }

    // BaseEntity.cs
    public class BaseEntity
    {
        public int Id { get; set; }
    }
}
