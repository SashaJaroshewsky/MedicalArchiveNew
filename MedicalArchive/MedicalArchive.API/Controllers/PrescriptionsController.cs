using MedicalArchive.API.Application.DTOs.PrescriptionDTOs;
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
    public class PrescriptionsController : ControllerBase
    {
        private readonly IPrescriptionService _prescriptionService;
        private readonly IDoctorAccessService _doctorAccessService;

        public PrescriptionsController(
            IPrescriptionService prescriptionService,
            IDoctorAccessService doctorAccessService)
        {
            _prescriptionService = prescriptionService;
            _doctorAccessService = doctorAccessService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrescriptionDto>>> GetAll()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _prescriptionService.GetAllByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionDto>> GetById(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _prescriptionService.GetByIdAsync(id, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PrescriptionDto>>> Search([FromQuery] string term)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _prescriptionService.SearchByMedicationNameAsync(userId, term);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<PrescriptionDto>>> GetByDateRange(
            [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _prescriptionService.GetByDateRangeAsync(userId, startDate, endDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<PrescriptionDto>> Create([FromForm] PrescriptionCreateDto prescriptionDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _prescriptionService.CreateAsync(userId, prescriptionDto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PrescriptionDto>> Update(int id, [FromForm] PrescriptionUpdateDto prescriptionDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _prescriptionService.UpdateAsync(id, userId, prescriptionDto);
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
                var result = await _prescriptionService.DeleteAsync(id, userId);
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
        public async Task<ActionResult<IEnumerable<PrescriptionDto>>> GetPatientPrescriptions(int patientId)
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

                var result = await _prescriptionService.GetAllByUserIdAsync(patientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("patient/{patientId}/{id}")]
        public async Task<ActionResult<PrescriptionDto>> GetPatientPrescriptionById(int patientId, int id)
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

                var result = await _prescriptionService.GetByIdAsync(id, patientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
