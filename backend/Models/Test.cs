using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApplication2.Models
{
    public class Test : BaseEntity
    {
        [Key]
        public int Id { get; set; }
        public string TestName { get; set; }
        public string CreatedBy { get; set; }
        public bool IsVerified { get; set; }
        public string CoverImagePath { get; set; } = "Images/default.png";
        public List<Question> Questions { get; set; }
        public List<Rating> UserRating { get; set; }
        public List<Tag> Tags { get; set; }

    }

    public class Question
    {
        [Key]
        public int QuestionId { get; set; }
        public string QuestionText { get; set; }
        public List<Answer> Answers { get; set; }
    }

    public class Answer
    {
        [Key]
        public int AnswerId { get; set; }
        public string AnswerText { get; set; }
        public bool IsCorrect { get; set; }
    }
    public class Rating
    {
        [Key]
        public int RatingId { get; set;}
        public int Grade { get; set;}
        public string ByUser { get; set; }
        public int ByUserId { get; set; }

    }
    public class Tag
    {
        [Key]
        public int TagId { get; set; }
        public string TagText { get; set; }
    }
}
