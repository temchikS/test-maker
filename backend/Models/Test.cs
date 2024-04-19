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
        public List<Question> Questions { get; set; }
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
}
