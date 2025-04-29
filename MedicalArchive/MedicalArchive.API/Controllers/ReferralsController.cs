using MedicalArchive.API.Application.DTOs.ReferralDTOs;
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
    public class ReferralsController : ControllerBase
    {
        private readonly IReferralService _referralService;
        private readonly IDoctorAccessService _doctorAccessService;

        public ReferralsController(
            IReferralService referralService,
            IDoctorAccessService doctorAccessService)
        {
            _referralService = referralService;
            _doctorAccessService = doctorAccessService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReferralDto>>> GetAll()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _referralService.GetAllByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReferralDto>> GetById(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _referralService.GetByIdAsync(id, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ReferralDto>>> Search([FromQuery] string term)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _referralService.SearchByTitleAsync(userId, term);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<ReferralDto>>> GetByDateRange(
            [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _referralService.GetByDateRangeAsync(userId, startDate, endDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ReferralDto>> Create([FromForm] ReferralCreateDto referralDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _referralService.CreateAsync(userId, referralDto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ReferralDto>> Update(int id, [FromForm] ReferralUpdateDto referralDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _referralService.UpdateAsync(id, userId, referralDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _referralService.DeleteAsync(id, userId);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Для лікарів - доступ до даних пацієнтів
        [Authorize(Roles = "Doctor")]
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<ReferralDto>>> GetPatientReferrals(int patientId)
        {
            try
            {
                var doctorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                // Перевіряємо, чи має лікар доступ до даних пацієнта
                var hasAccess = await _doctorAccessService.HasAccessAsync(patientId, doctorId);
                if (!hasAccess)
                {
                    return Forbid();
                }

                var result = await _referralService.GetAllByUserIdAsync(patientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("patient/{patientId}/{id}")]
        public async Task<ActionResult<ReferralDto>> GetPatientReferralById(int patientId, int id)
        {
            try
            {
                var doctorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                // Перевіряємо, чи має лікар доступ до даних пацієнта
                var hasAccess = await _doctorAccessService.HasAccessAsync(patientId, doctorId);
                if (!hasAccess)
                {
                    return Forbid();
                }

                var result = await _referralService.GetByIdAsync(id, patientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
