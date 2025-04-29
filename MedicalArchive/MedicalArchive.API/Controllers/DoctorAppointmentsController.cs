using MedicalArchive.API.Application.DTOs.DoctorAppointmentDTOs;
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
    public class DoctorAppointmentsController : ControllerBase
    {
        private readonly IDoctorAppointmentService _appointmentService;
        private readonly IDoctorAccessService _doctorAccessService;

        public DoctorAppointmentsController(
            IDoctorAppointmentService appointmentService,
            IDoctorAccessService doctorAccessService)
        {
            _appointmentService = appointmentService;
            _doctorAccessService = doctorAccessService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DoctorAppointmentDto>>> GetAll()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _appointmentService.GetAllByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DoctorAppointmentDto>> GetById(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _appointmentService.GetByIdAsync(id, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<DoctorAppointmentDto>>> Search([FromQuery] string term)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _appointmentService.SearchByTitleAsync(userId, term);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<DoctorAppointmentDto>>> GetByDateRange(
            [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _appointmentService.GetByDateRangeAsync(userId, startDate, endDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<DoctorAppointmentDto>> Create([FromForm] DoctorAppointmentCreateDto appointmentDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _appointmentService.CreateAsync(userId, appointmentDto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DoctorAppointmentDto>> Update(int id, [FromForm] DoctorAppointmentUpdateDto appointmentDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _appointmentService.UpdateAsync(id, userId, appointmentDto);
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
                var result = await _appointmentService.DeleteAsync(id, userId);
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
        public async Task<ActionResult<IEnumerable<DoctorAppointmentDto>>> GetPatientAppointments(int patientId)
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

                var result = await _appointmentService.GetAllByUserIdAsync(patientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("patient/{patientId}/{id}")]
        public async Task<ActionResult<DoctorAppointmentDto>> GetPatientAppointmentById(int patientId, int id)
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

                var result = await _appointmentService.GetByIdAsync(id, patientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
