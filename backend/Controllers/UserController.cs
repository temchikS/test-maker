using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebApplication2.ApplicationDbContext;
using WebApplication2.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly string _jwtSecret = "POjFhc2JHVjhvJGfjgkjkloiY4sdsa53gdf65gd7GhjGJcgfFTr234e98t7IYUj234MKL";
        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                                    .Include(u => u.MakedTests)
                                    .Include(u => u.PassedTests)
                                    .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(long id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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
        [HttpPost("MakeAdmin/{id}")]
        public async Task<IActionResult> MakeUserAdmin(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (user.Role == "admin")
            {
                return BadRequest("User is already an admin.");
            }

            user.Role = "admin";
            _context.Entry(user).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return Ok($"User {user.Username} has been made an admin.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error making user an admin: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(long id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UploadProfilePicture(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded.");
                }
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (!int.TryParse(userId, out var id))
                {
                    return Unauthorized("Invalid user ID.");
                }

                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var fileName = Path.GetFileName(file.FileName);
                var filePath = Path.Combine("Images", "ProfilePictures", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                user.ProfilePicture = $"http://localhost:5228/Images/ProfilePictures/{fileName}";
                await _context.SaveChangesAsync();

                return Ok(new { message = "Avatar updated.", path = user.ProfilePicture });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Authorization([FromBody] LoginRequestModel model)
        {
            string username = model.Username;
            string password = model.Password;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound("Пользователь с таким именем не найден.");
            }

            if (user.Password != password)
            {
                return Unauthorized("Неверный пароль.");
            }

            var token = GenerateJwtToken(user);

            return Ok(new { Username = user.Username, Token = token });
        }


        private string GenerateJwtToken(User user)
        {

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("Age", user.Age.ToString()), 
                new Claim(ClaimTypes.Role, user.Role) 
            };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "alisherMaker",
                audience: "ludi",
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        [HttpPost("Registration")]
        public async Task<IActionResult> RegisterUser(User user)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Username == user.Username))
                {
                    return BadRequest("Пользователь с таким именем уже существует");
                }
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { Username = user.Username});
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Произошла ошибка при регистрации: {ex.Message}");
            }
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserData()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userId, out var id))
            {
                return Unauthorized("Invalid user ID.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new
            {
                Username = user.Username,
                UserAge = user.Age,
                UserRole = user.Role,
                ProfilePicture = user.ProfilePicture
        });

        }

    }
}
