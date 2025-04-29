using MedicalArchive.API.Application.DTOs.VaccinationDTOs;
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
    public class VaccinationsController : ControllerBase
    {
        private readonly IVaccinationService _vaccinationService;
        private readonly IDoctorAccessService _doctorAccessService;

        public VaccinationsController(
            IVaccinationService vaccinationService,
            IDoctorAccessService doctorAccessService)
        {
            _vaccinationService = vaccinationService;
            _doctorAccessService = doctorAccessService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VaccinationDto>>> GetAll()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _vaccinationService.GetAllByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VaccinationDto>> GetById(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _vaccinationService.GetByIdAsync(id, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<VaccinationDto>>> Search([FromQuery] string term)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _vaccinationService.SearchByVaccineNameAsync(userId, term);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<VaccinationDto>>> GetByDateRange(
            [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _vaccinationService.GetByDateRangeAsync(userId, startDate, endDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<VaccinationDto>> Create([FromForm] VaccinationCreateDto vaccinationDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _vaccinationService.CreateAsync(userId, vaccinationDto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<VaccinationDto>> Update(int id, [FromForm] VaccinationUpdateDto vaccinationDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _vaccinationService.UpdateAsync(id, userId, vaccinationDto);
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
                var result = await _vaccinationService.DeleteAsync(id, userId);
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
        public async Task<ActionResult<IEnumerable<VaccinationDto>>> GetPatientVaccinations(int patientId)
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

                var result = await _vaccinationService.GetAllByUserIdAsync(patientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("patient/{patientId}/{id}")]
        public async Task<ActionResult<VaccinationDto>> GetPatientVaccinationById(int patientId, int id)
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

                var result = await _vaccinationService.GetByIdAsync(id, patientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
