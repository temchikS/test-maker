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
            var user = await _context.Users.FindAsync(id);

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


        [HttpPost("Login")]
        public async Task<IActionResult> Authorization([FromBody] LoginRequestModel model)
        {
            string username = model.Username;
            string password = model.Password;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.Password == password);

            if (user == null)
            {
                return Unauthorized();
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
        public IActionResult MainPage()
        {
            var userAge = User.FindFirst("Age")?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value; 
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            return Ok(new { UserAge = userAge, UserRole = userRole, Username = username });
        }

    }
}
