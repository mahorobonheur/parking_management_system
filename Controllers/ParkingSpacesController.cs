using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParkingManagementSystem.Data;
using ParkingManagementSystem.Models;

namespace ParkingManagementSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ParkingSpacesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ParkingSpacesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParkingSpace>>> GetParkingSpaces(
            [FromQuery] int? parkingLotId,
            CancellationToken cancellationToken)
        {
            var q = _context.ParkingSpaces.AsNoTracking().AsQueryable();
            if (parkingLotId is int lid)
                q = q.Where(s => s.ParkingLotId == lid);
            return await q.OrderBy(s => s.Zone).ThenBy(s => s.SpaceNumber).ToListAsync(cancellationToken);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ParkingSpace>> GetParkingSpace(int id, CancellationToken cancellationToken)
        {
            var parkingSpace = await _context.ParkingSpaces.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

            if (parkingSpace is null)
            {
                return NotFound();
            }

            return parkingSpace;
        }

        [HttpPut("{id}")]
        [Authorize(Roles = AppRoles.Admin)]
        public async Task<IActionResult> PutParkingSpace(int id, ParkingSpace parkingSpace, CancellationToken cancellationToken)
        {
            if (id != parkingSpace.Id)
            {
                return BadRequest();
            }

            var entity = await _context.ParkingSpaces.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
            if (entity is null)
            {
                return NotFound();
            }

            entity.SpaceNumber = parkingSpace.SpaceNumber;
            entity.Location = parkingSpace.Location;
            entity.Status = parkingSpace.Status;
            entity.Zone = parkingSpace.Zone;
            entity.HourlyRate = parkingSpace.HourlyRate;
            entity.MaxStayMinutes = parkingSpace.MaxStayMinutes;
            entity.ParkingLotId = parkingSpace.ParkingLotId;
            entity.SlotCategory = string.IsNullOrWhiteSpace(parkingSpace.SlotCategory) ? SlotCategories.Standard : parkingSpace.SlotCategory;
            entity.MapRow = parkingSpace.MapRow;
            entity.MapColumn = parkingSpace.MapColumn;
            entity.IsUnderMaintenance = parkingSpace.IsUnderMaintenance;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ParkingSpaceExistsAsync(id, cancellationToken))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        [HttpPost]
        [Authorize(Roles = AppRoles.Admin)]
        public async Task<ActionResult<ParkingSpace>> PostParkingSpace(ParkingSpace parkingSpace, CancellationToken cancellationToken)
        {
            parkingSpace.Status = string.IsNullOrWhiteSpace(parkingSpace.Status) ? "Available" : parkingSpace.Status;
            if (parkingSpace.ParkingLotId == 0)
            {
                var firstLot = await _context.ParkingLots.OrderBy(l => l.Id).Select(l => l.Id).FirstOrDefaultAsync(cancellationToken);
                if (firstLot == 0)
                    return BadRequest(new { error = "Create a parking lot first (bootstrap should add MAIN)." });
                parkingSpace.ParkingLotId = firstLot;
            }

            if (string.IsNullOrWhiteSpace(parkingSpace.SlotCategory))
                parkingSpace.SlotCategory = SlotCategories.Standard;

            _context.ParkingSpaces.Add(parkingSpace);
            await _context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetParkingSpace), new { id = parkingSpace.Id }, parkingSpace);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = AppRoles.Admin)]
        public async Task<IActionResult> DeleteParkingSpace(int id, CancellationToken cancellationToken)
        {
            var parkingSpace = await _context.ParkingSpaces.FindAsync(new object[] { id }, cancellationToken);
            if (parkingSpace is null)
            {
                return NotFound();
            }

            var hasOpenSession = await _context.ParkingSessions.AnyAsync(
                s => s.ParkingSpaceId == id && s.CheckOutUtc == null,
                cancellationToken);
            if (hasOpenSession)
            {
                return Conflict(new { error = "Cannot delete a space with an active parking session." });
            }

            _context.ParkingSpaces.Remove(parkingSpace);
            await _context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }

        private Task<bool> ParkingSpaceExistsAsync(int id, CancellationToken cancellationToken)
        {
            return _context.ParkingSpaces.AnyAsync(e => e.Id == id, cancellationToken);
        }
    }
}
