using MedicalArchive.API.Application.DTOs.DoctorAccessDTOs;
using MedicalArchive.API.Application.DTOs.UserDTOs;
using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedicalArchive.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorAccessController : ControllerBase
    {
        private readonly IDoctorAccessService _doctorAccessService;

        public DoctorAccessController(IDoctorAccessService doctorAccessService)
        {
            _doctorAccessService = doctorAccessService;
        }

        [HttpGet("doctors")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetDoctorsWithAccess()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _doctorAccessService.GetDoctorsWithAccessToUserAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("patients")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetPatientsWithAccess()
        {
            try
            {
                var doctorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _doctorAccessService.GetUsersByDoctorAccessAsync(doctorId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("grant")]
        public async Task<ActionResult<DoctorAccessDto>> GrantAccess([FromBody] DoctorAccessCreateDto accessDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _doctorAccessService.GrantAccessAsync(userId, accessDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("revoke/{doctorId}")]
        public async Task<ActionResult> RevokeAccess(int doctorId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _doctorAccessService.RevokeAccessAsync(userId, doctorId);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
