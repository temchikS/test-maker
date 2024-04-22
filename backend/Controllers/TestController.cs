using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication2.ApplicationDbContext;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class TestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Test>>> GetAllTests()
        {
            return await _context.Tests.ToListAsync();
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Test>>> GetNotVerifiedTests()
        {
            var notVerifiedTests = await _context.Tests.Where(t => !t.IsVerified).ToListAsync();
            return notVerifiedTests;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Test>>> GetTests()
        {
            var verifiedTests = await _context.Tests.Where(t => t.IsVerified).ToListAsync();
            return verifiedTests;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Test>> GetVerifiedTestById(int id)
        {
            var test = await _context.Tests
                .Include(t => t.Questions) 
                .ThenInclude(q => q.Answers) 
                .FirstOrDefaultAsync(t => t.Id == id && t.IsVerified);

            if (test == null)
            {
                return NotFound();
            }

            return test;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Test>> GetNotVerifiedTestById(int id)
        {
            var test = await _context.Tests
                .Include(t => t.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(t => t.Id == id && !t.IsVerified);

            if (test == null)
            {
                return NotFound();
            }

            return test;
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")] 
        public async Task<IActionResult> VerifyTest(int id)
        {
            var test = await _context.Tests.FindAsync(id);
            if (test == null)
            {
                return NotFound();
            }
            test.IsVerified = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Test verified." });
        }
        [HttpPost]
        public async Task<ActionResult<Test>> CreateTest([FromForm] Test test, IFormFile coverImage)
        {
            if (coverImage != null && coverImage.Length > 0)
            {
                var fileName = Path.GetFileName(coverImage.FileName);
                var filePath = Path.Combine("Images", "TestPictures", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await coverImage.CopyToAsync(stream);
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await coverImage.CopyToAsync(stream);
                }
                test.CoverImagePath = $"http://localhost:5228/Images/TestPictures/{fileName}";

            }
            var createdByUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == test.CreatedBy);
            if (createdByUser == null)
            {
                return NotFound($"Пользователь с именем {test.CreatedBy} не найден.");
            }
            createdByUser.MakedTests ??= new List<MakedTest>(); 
            createdByUser.MakedTests.Add(new MakedTest { TestId = test.Id });
            _context.Tests.Add(test);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotVerifiedTestById), new { id = test.Id }, test);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTest(int id, Test test)
        {
            if (id != test.Id)
            {
                return BadRequest();
            }

            _context.Entry(test).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Test>> DeleteTest(int id)
        {
            var test = await _context.Tests
                .Include(t => t.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (test == null)
            {
                return NotFound();
            }

            _context.Tests.Remove(test);
            await _context.SaveChangesAsync();

            return test;
        }


        private bool TestExists(int id)
        {
            return _context.Tests.Any(e => e.Id == id);
        }
    }
}
