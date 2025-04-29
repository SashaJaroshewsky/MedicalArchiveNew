using MedicalArchive.API.Application.DTOs.MedicalCertificateDTOs;
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
    public class MedicalCertificatesController : ControllerBase
    {
        private readonly IMedicalCertificateService _certificateService;
        private readonly IDoctorAccessService _doctorAccessService;

        public MedicalCertificatesController(
            IMedicalCertificateService certificateService,
            IDoctorAccessService doctorAccessService)
        {
            _certificateService = certificateService;
            _doctorAccessService = doctorAccessService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalCertificateDto>>> GetAll()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _certificateService.GetAllByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalCertificateDto>> GetById(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _certificateService.GetByIdAsync(id, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<MedicalCertificateDto>>> Search([FromQuery] string term)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _certificateService.SearchByTitleAsync(userId, term);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<MedicalCertificateDto>>> GetByDateRange(
            [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _certificateService.GetByDateRangeAsync(userId, startDate, endDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<MedicalCertificateDto>> Create([FromForm] MedicalCertificateCreateDto certificateDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _certificateService.CreateAsync(userId, certificateDto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MedicalCertificateDto>> Update(int id, [FromForm] MedicalCertificateUpdateDto certificateDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _certificateService.UpdateAsync(id, userId, certificateDto);
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
                var result = await _certificateService.DeleteAsync(id, userId);
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
        public async Task<ActionResult<IEnumerable<MedicalCertificateDto>>> GetPatientCertificates(int patientId)
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

                var result = await _certificateService.GetAllByUserIdAsync(patientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("patient/{patientId}/{id}")]
        public async Task<ActionResult<MedicalCertificateDto>> GetPatientCertificateById(int patientId, int id)
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

                var result = await _certificateService.GetByIdAsync(id, patientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
