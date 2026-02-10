import { Booking, Job } from '../types/booking.types';

type ParsedPoint = { latitude: number; longitude: number } | null;

const parseLocationPoint = (value: unknown): ParsedPoint => {
  if (!value) return null;

  if (typeof value === 'object' && value !== null) {
    const coords = (value as { coordinates?: [number, number] }).coordinates;
    if (Array.isArray(coords) && coords.length >= 2) {
      const [lng, lat] = coords;
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }
  }

  if (typeof value === 'string') {
    const match = value.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/i);
    if (match) {
      const lng = Number.parseFloat(match[1]);
      const lat = Number.parseFloat(match[2]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }
  }

  return null;
};

export const mapApiJobToUiJob = (job: any): Job => {
  const point = parseLocationPoint(job?.location_point);
  const budgetMin = typeof job?.budget_min === 'number' ? job.budget_min : 0;
  const budgetMax = typeof job?.budget_max === 'number' ? job.budget_max : 0;

  return {
    id: job?.id ?? '',
    serviceType: job?.service_type ?? '',
    description: job?.description ?? '',
    location: {
      address: job?.address ?? '',
      latitude: point?.latitude ?? 0,
      longitude: point?.longitude ?? 0,
    },
    startTime: new Date(job?.start_time ?? Date.now()),
    endTime: new Date(job?.end_time ?? Date.now()),
    budgetMin,
    budgetMax,
    status: job?.status ?? 'DRAFT',
    createdAt: new Date(job?.created_at ?? Date.now()),
  };
};

export const mapApiBookingToUiBooking = (booking: any): Booking => {
  const job = booking?.job ?? {};
  const client = job?.client ?? {};
  const point = parseLocationPoint(job?.location_point);

  return {
    id: booking?.id ?? '',
    jobId: booking?.job_id ?? job?.id ?? '',
    clientId: job?.client_id ?? '',
    clientName: client?.full_name || client?.phone || 'Khách hàng',
    agreedRate: typeof booking?.agreed_rate === 'number' ? booking.agreed_rate : 0,
    startTime: new Date(booking?.start_time ?? Date.now()),
    endTime: new Date(booking?.end_time ?? Date.now()),
    location: {
      address: job?.address ?? client?.address ?? '',
      latitude: point?.latitude ?? 0,
      longitude: point?.longitude ?? 0,
    },
    status: booking?.status ?? 'SCHEDULED',
    createdAt: new Date(booking?.created_at ?? Date.now()),
    timesheet: booking?.timesheet
      ? {
          checkinAt: booking.timesheet.checkin_at
            ? new Date(booking.timesheet.checkin_at)
            : undefined,
          checkoutAt: booking.timesheet.checkout_at
            ? new Date(booking.timesheet.checkout_at)
            : undefined,
          hours: booking.timesheet.hours,
          clientConfirmed: Boolean(booking.timesheet.client_confirmed),
        }
      : undefined,
  };
};
