using MedicalArchive.API.Application.DTOs.AuthDTOs;
using MedicalArchive.API.Application.DTOs.UserDTOs;
using MedicalArchive.API.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MedicalArchive.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] UserRegistrationDto registrationDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(registrationDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenDto>> Login([FromBody] UserLoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
