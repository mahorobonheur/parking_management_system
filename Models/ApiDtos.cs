using System.ComponentModel.DataAnnotations;

namespace ParkingManagementSystem.Models;

public class CreateReservationDto
{
    [Required]
    public int ParkingSpaceId { get; set; }

    [Required]
    public DateTime StartUtc { get; set; }

    [Required]
    public DateTime EndUtc { get; set; }
}

public class CheckInDto
{
    [Required]
    public int ParkingSpaceId { get; set; }

    [Required]
    [MaxLength(32)]
    public string LicensePlate { get; set; } = string.Empty;

    public int? ReservationId { get; set; }

    /// <summary>Walk-up / visitor ticket (no linked account).</summary>
    public bool IsVisitor { get; set; }

    /// <summary>Optional registered driver to attach when known.</summary>
    public string? ApplicationUserId { get; set; }
}

public class CheckInResponseDto
{
    public int SessionId { get; set; }

    public string TicketCode { get; set; } = string.Empty;

    /// <summary>Payload encoded in QR (same as ticket code for this build).</summary>
    public string QrPayload { get; set; } = string.Empty;

    public DateTime CheckInUtc { get; set; }

    public int ParkingSpaceId { get; set; }

    public string LicensePlate { get; set; } = string.Empty;

    public bool IsVisitor { get; set; }
}

public class CheckOutByTicketDto
{
    [Required]
    [MaxLength(48)]
    public string TicketCode { get; set; } = string.Empty;
}

public class SessionSearchRowDto
{
    public int SessionId { get; set; }

    public int ParkingSpaceId { get; set; }

    public string SpaceNumber { get; set; } = string.Empty;

    public int ParkingLotId { get; set; }

    public string LotName { get; set; } = string.Empty;

    public string LicensePlate { get; set; } = string.Empty;

    public string TicketCode { get; set; } = string.Empty;

    public DateTime CheckInUtc { get; set; }

    public SessionIncidentKind IncidentKind { get; set; }

    public string? Notes { get; set; }
}

public class PatchSessionIncidentDto
{
    public SessionIncidentKind IncidentKind { get; set; }

    public string? Notes { get; set; }
}

public class ReassignSessionDto
{
    [Required]
    public int NewParkingSpaceId { get; set; }
}

public class UpdateReservationDto
{
    [Required]
    public DateTime StartUtc { get; set; }

    [Required]
    public DateTime EndUtc { get; set; }
}

public class LiveMapDto
{
    public int ParkingLotId { get; set; }

    public string LotName { get; set; } = string.Empty;

    public int AvailableCount { get; set; }

    public int OccupiedCount { get; set; }

    public int ReservedCount { get; set; }

    public int MaintenanceCount { get; set; }

    public int OverstayCount { get; set; }

    public List<LiveSpaceCellDto> Spaces { get; set; } = new();
}

public class LiveSpaceCellDto
{
    public int Id { get; set; }

    public string SpaceNumber { get; set; } = string.Empty;

    public string SlotCategory { get; set; } = string.Empty;

    public int? MapRow { get; set; }

    public int? MapColumn { get; set; }

    public string Zone { get; set; } = string.Empty;

    /// <summary>Available | Occupied | Reserved | Maintenance | Overstay</summary>
    public string DisplayState { get; set; } = string.Empty;

    public int? ActiveSessionId { get; set; }

    public DateTime? ReservationEndsUtc { get; set; }

    public bool IsOverstay { get; set; }

    public int? Floor { get; set; }

    public string? CustomLabel { get; set; }
}

public class VehicleDto
{
    public int Id { get; set; }

    public string PlateNumber { get; set; } = string.Empty;

    public string? Label { get; set; }
}

public class CreateVehicleDto
{
    [Required]
    [MaxLength(32)]
    public string PlateNumber { get; set; } = string.Empty;

    [MaxLength(64)]
    public string? Label { get; set; }
}

public class UserListItemDto
{
    public string Id { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string? FullName { get; set; }

    public bool LockoutEnabled { get; set; }

    public DateTimeOffset? LockoutEnd { get; set; }

    public IList<string> Roles { get; set; } = new List<string>();
}

public class OccupancyByZoneItem
{
    public string Zone { get; set; } = string.Empty;

    public int TotalSpaces { get; set; }

    public int OccupiedSpaces { get; set; }
}

public class RevenueSeriesPoint
{
    public DateOnly Day { get; set; }

    public decimal Revenue { get; set; }

    public int SessionsEnded { get; set; }
}

public class ReportsOverviewDto
{
    public int TotalSpaces { get; set; }

    public int AvailableSpaces { get; set; }

    public int OccupiedSpaces { get; set; }

    public int ActiveSessions { get; set; }

    public int ReservationsUpcoming { get; set; }

    public decimal EstimatedRevenueToday { get; set; }
}

public class MyActivityDto
{
    public int ReservationsTotal { get; set; }

    public int ActiveReservations { get; set; }

    public bool HasActiveSession { get; set; }

    public int? ActiveSessionId { get; set; }

    /// <summary>Last completed session space (Find my car).</summary>
    public string? LastParkedSpaceNumber { get; set; }

    public DateTime? LastCheckOutUtc { get; set; }
}

public class AvailabilitySpaceDto
{
    public int Id { get; set; }

    public int ParkingLotId { get; set; }

    public string LotName { get; set; } = string.Empty;

    public string? LotAddress { get; set; }

    public string SpaceNumber { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string Zone { get; set; } = string.Empty;

    public decimal HourlyRate { get; set; }
}

public class CreateParkingLotDto
{
    [Required]
    [MaxLength(128)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(256)]
    public string? Address { get; set; }

    /// <summary>Optional unique code (letters/digits). Auto-generated if omitted.</summary>
    [MaxLength(32)]
    public string? Code { get; set; }
}

public class UpdateParkingLotDto
{
    [Required]
    [MaxLength(128)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(256)]
    public string? Address { get; set; }

    [MaxLength(32)]
    public string? Code { get; set; }
}

public class CreateWaitlistEntryDto
{
    [Required]
    public int ParkingLotId { get; set; }

    public int? ParkingSpaceIdPreferred { get; set; }

    [Required]
    public DateTime RequestedStartUtc { get; set; }

    [Required]
    public DateTime RequestedEndUtc { get; set; }

    [Required]
    [MaxLength(32)]
    public string LicensePlate { get; set; } = string.Empty;
}

public class CreateWebhookSubscriptionDto
{
    [Required]
    [MaxLength(512)]
    public string TargetUrl { get; set; } = string.Empty;

    [MaxLength(128)]
    public string? Secret { get; set; }

    /// <summary>Comma-separated event ids (empty = all configured events).</summary>
    [MaxLength(512)]
    public string? SubscribedEvents { get; set; }
}

public class PatchWebhookSubscriptionDto
{
    public bool? IsActive { get; set; }

    [MaxLength(512)]
    public string? SubscribedEvents { get; set; }
}
