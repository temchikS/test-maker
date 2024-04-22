using System.ComponentModel.DataAnnotations;

namespace WebApplication2.Models
{
    public class User : BaseEntity
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public int Age { get; set; }
        public string Role { get; set; }
        public string ProfilePicture { get; set; } = "http://localhost:5228/Images/default.png";
        public List<MakedTest> MakedTests { get; set; }
        public List<PassedTest> PassedTests { get; set; }
    }


    public class MakedTest
    {
        [Key]
        public int TestId { get; set; }
    }
    public class PassedTest
    {
        [Key]
        public int TestId { get; set; }
        public int Time {  get; set; }
        public int Result { get; set; }
    }
    public class BaseEntity
    {
        public int Id { get; set; }
    }
}
