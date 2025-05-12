export function getTimeZoneInfo(): { timeZone: string; timeOffset: string } {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const offsetMinutes = new Date().getTimezoneOffset();
  const offsetHours = Math.abs(offsetMinutes) / 60;
  const sign = offsetMinutes > 0 ? '-' : '+';
  const timeOffset = `${sign}${String(Math.floor(offsetHours)).padStart(2, '0')}:00`;

  return { timeZone, timeOffset };
}
